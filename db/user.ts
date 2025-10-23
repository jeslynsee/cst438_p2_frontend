// import * as SQLite from "expo-sqlite";
// import type { User } from "@/types/user";

// export interface DBUserRow {
//     id: number;
//     g_id: string | null;
//     username: string;
//     email: string | null;
//     profile_pic: string | null;
// }

// export const createUser = async (user: Pick<User, 'username' | 'email' | 'profile_pic'> & { g_id?: string | null }): Promise<number> => {
//     console.log('Creating user:', user)

//     const db = await SQLite.openDatabaseAsync('flexzone_database');

//     // If Google ID provided (legacy), check by that. Otherwise check by email/username
//     if (user.g_id) {
//         const existsByG = await getUserByGoogleId(user.g_id);
//         if (existsByG) {
//             console.log('User already exists (g_id):', existsByG)
//             return existsByG.id;
//         }
//     }

//     if (user.email) {
//         const existsByEmail = await getUserByEmail(user.email);
//         if (existsByEmail) {
//             console.log('User already exists (email):', existsByEmail)
//             return existsByEmail.id;
//         }
//     }

//     const existsByUsername = await getUserByUsername(user.username);
//     if (existsByUsername) {
//         console.log('User already exists (username):', existsByUsername)
//         return existsByUsername.id;
//     }

//     const response = await db.runAsync('INSERT INTO user (g_id, username, email, profile_pic) VALUES (?, ?, ?, ?)', [
//         user.g_id ?? null, user.username, user.email ?? null, user.profile_pic ?? null
//     ])

//     return response.lastInsertRowId;
// }

// export const getUserByGoogleId = async (g_id: string): Promise<DBUserRow | undefined> => {
//     console.log('Getting user by google id:', g_id)
//     const db = await SQLite.openDatabaseAsync('flexzone_database');

//     const user = await db.getFirstAsync('SELECT * FROM user WHERE g_id = ?', [g_id]) as DBUserRow | undefined;
//     console.log('User: ', user)

//     return user;
// }

// export const getUserByEmail = async (email: string): Promise<DBUserRow | undefined> => {
//     console.log('Getting user by email:', email)
//     const db = await SQLite.openDatabaseAsync('flexzone_database');

//     const user = await db.getFirstAsync('SELECT * FROM user WHERE email = ?', [email]) as DBUserRow | undefined;
//     return user;
// }

// export const getUserByUsername = async (username: string): Promise<DBUserRow | undefined> => {
//     console.log('Getting user by username:', username)
//     const db = await SQLite.openDatabaseAsync('flexzone_database');

//     const user = await db.getFirstAsync('SELECT * FROM user WHERE username = ?', [username]) as DBUserRow | undefined;
//     return user;
// }