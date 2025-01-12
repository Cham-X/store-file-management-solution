"use server"

import { Query, ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from ".."
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getUserByEmail = async (email: string) => {
    const { databases } = await createAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("email", [email])],
    );
    return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
    console.log(error, message)
}

export const sendEmailOTP = async ({ email }: { email: string }) => {
    const { account } = await createAdminClient();

    try {
        const session = await account.createEmailToken(ID.unique(), email)

        return session.userId
    } catch (error) {
        handleError(error, "Fail to send email OTP")
    }
}

export const createAccount = async ({ fullName, email }: { fullName: string, email: string }) => {
    const exisitingUser = await getUserByEmail(email)

    const accountId = await sendEmailOTP({ email })

    if (!accountId) throw new Error("Fail to send AN OTP")

    if (!exisitingUser) {
        const { databases } = await createAdminClient()

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                fullName,
                email,
                avatar: "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg",
                accountId,
            }
        )
    }

    return parseStringify({ accountId })
}

export const verifySecrete = async ({ accountId, password }: { accountId: string, password: string }) => {
    try {
        const { account } = await createAdminClient()

        const session = await account.createSession(accountId, password);

        (await cookies()).set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        })

        return parseStringify({ sessionId: session.$id })

    } catch (error) {
        console.log(error)
    }
}

export const getCurrentUser = async () => {
    try {
        const { databases, account } = await createSessionClient()

        const result = await account.get()

        const user = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", result.$id)],
        )
        // console.log(user)
        if (user.total <= 0) return null;

        return parseStringify(user.documents[0])
    } catch (error) {
        console.log(error)
    }

}

export const signOutUser = async () => {
    const { account } = await createSessionClient();

    try {
        await account.deleteSession("current");
        ((await cookies()).delete("appwrite-session"))
    } catch (error) {
        handleError(error, "Failed to log out user")
    } finally {
        redirect("/sign-in")
    }
}

export const signInUser = async ({ email }: { email: string }) => {
    try {
        const exisitingUser = await getUserByEmail(email)

        if (exisitingUser) {
            await sendEmailOTP({ email })
            return parseStringify({ accountId: exisitingUser.accountId })
        }

        return parseStringify({ accountId: null, error: "user not found" })
    } catch (error) {
        handleError(error, "Failed to sign in user")
    }
}