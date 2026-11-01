import avatar from '../../assets/avatar_pink_hair_hoodie.png';
import { useState } from 'react';

export default function Profile() {

    const mockUser = {
        username: "janedoe1",
        name: "Jane Doe",
        email: "janedoe123@example.com",
        joined: "2026-05-15",
        avatar,
    };

    const [user, setUser] = useState(() => {
        try {
            const savedProfile = localStorage.getItem("mockProfile");

            return savedProfile ? JSON.parse(savedProfile) : mockUser;
        } catch {
            return mockUser;
        }
    });
    const [isEditing, setIsEditing] = useState(false);
    const [draftUsername, setDraftUsername] = useState(user.username);
    const [draftName, setDraftName] = useState(user.name);
    const [draftEmail, setDraftEmail] = useState(user.email);
    const [nameError, setNameError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const hasProfileChanged =
    draftName.trim() !== user.name ||
    draftUsername.trim() !== user.username ||
    draftEmail.trim() !== user.email;
    const [successMessage, setSuccessMessage] = useState("");

    function handleSave(event) {
        event.preventDefault();

        const trimmedName = draftName.trim();
        const trimmedUsername = draftUsername.trim();
        const trimmedEmail = draftEmail.trim();

        const nextNameError =
            trimmedName === "" ? "Please enter your name." : "";

        const nextUsernameError =
            /^[a-zA-Z0-9_]{3,20}$/.test(trimmedUsername)
                ? ""
                : "Use 3–20 characters: letters, numbers, or underscores.";

        setUsernameError(nextUsernameError);
        setNameError(nextNameError);

        if (nextNameError !== "" || nextUsernameError !== "") {
            return;
        }

        const updatedUser = {
            ...user,
            name: trimmedName,
            username: trimmedUsername,
            email: trimmedEmail,
        };

        setUser(updatedUser);

        localStorage.setItem("mockProfile", JSON.stringify(updatedUser));

        setSuccessMessage("Profile updated.")
        setIsEditing(false);
    }

    return (
        <main className="mx-auto w-full max-w-5xl p-6">
            <div className="flex md:flex-row flex-col gap-6 bg-white rounded-2xl p-5 shadow-sm md-flex-row text-black">
                <section className="flex flex-col items-center gap-3 rounded-xl bg-lime-100 p-6 md:w-1/3">
        
                    <img
                        className="h-42 w-42 rounded-full object-cover border-6 border-white"
                        src={user.avatar}
                        alt="User's avatar"
                    />
                    <h1 className="text-4xl font-bold">
                        {user.username}
                    </h1>
                    <p className="text-center text-sm text-gray-600">
                        Member since {user.joined}
                    </p>
                    <button
                        type="button"
                        disabled={isEditing}
                        className="rounded-lg bg-lime-600 px-6 py-2 text-white hover:bg-lime-700 hover:shadow-xl focus-visible:outline-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => {
                                setDraftName(user.name);
                                setDraftUsername(user.username);
                                setDraftEmail(user.email);
                                setNameError("");
                                setUsernameError("");
                                setSuccessMessage("");
                                setIsEditing(true);
                        }}
                    >
                        Edit profile
                    </button>

                </section>

            <section className="min-w-0 flex-1 p-4">
                <h2 className="mb-6 text-2xl font-bold border-b-2 border-b-black pb-3">
                    Account details
                </h2>
                {!isEditing && (
                <dl className="grid grid-cols-[7rem_minmax(0,1fr)] gap-x-4 gap-y-4 text-lg">

                    <dt className="text-gray-600">Username</dt>
                    <dd className="font-semibold">{user.username}</dd>

                    <dt className="text-gray-600">Name</dt>
                    <dd className="font-semibold">{user.name}</dd>

                    <dt className="text-gray-600">Email</dt>
                    <dd className="font-semibold wrap-break-word">{user.email}</dd>
                </dl>
                )}
                <p role="status" className="mt-4 text-sm text-green-700">
                    {successMessage}
                </p>
                {isEditing && (
                <form onSubmit={handleSave}
                    className="grid grid-cols-[7rem_minmax(0,1fr)] gap-x-4 gap-y-4 text-lg">
                    
                    <label htmlFor="username" className="mb-2 block font-medium">
                        Username
                    </label>
                    
                    <input 
                        id="username"
                        type="text"
                        value={draftUsername}
                        onChange={(event) => setDraftUsername(event.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        aria-invalid={usernameError !== ""}
                        aria-describedby={usernameError ? "username-error" : undefined}    
                    />
                    {
                        usernameError && (
                            <p id="username-error" role="alert" className="col-start-2 text-sm text-red-600">
                                {usernameError}
                            </p>
                    )}
                    <label className="mb-2 block font-medium" htmlFor="name">
                        Name
                    </label>

                    <input
                        id="name"
                        type="text"
                        value={draftName}
                        onChange={(event) => setDraftName(event.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-lime-600 focus:ring-2 focus:ring-lime-200"
                        aria-invalid={nameError !== ""}
                        aria-describedby={nameError ? "name-error" : undefined}
                    />
                    {nameError && (
                        <p id="name-error" role="alert" className="col-start-2 text-sm text-red-600">
                            {nameError}
                        </p>
                    )}

                    <label className="mb-2 block font-medium" htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        required
                        value={draftEmail}
                        onChange={(event) => setDraftEmail(event.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-lime-600 focus:ring-2 focus:ring-lime-200"
                    />

                    <div className="col-span-2 mt-4 flex justify-end gap-3 text-sm">
                        <button
                        type="submit"
                        disabled={!hasProfileChanged}
                        className="rounded-lg bg-lime-600 px-4 py-2 font-semibold text-white hover:bg-lime-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        Save changes
                        </button>
                        <button type="button"
                            className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700"
                            onClick={()=> {
                                setDraftName(user.name);
                                setDraftUsername(user.username);
                                setDraftEmail(user.email);
                                setUsernameError("");
                                setNameError("");
                                setIsEditing(false)}}>
                            Cancel
                        </button>
                    </div>
                </form>
                )}
            </section>
            </div>
        </main>
    );
}
