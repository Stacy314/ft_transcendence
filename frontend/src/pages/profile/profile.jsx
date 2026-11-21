import avatar from '../../assets/pastel_avatar_2.png';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Card from '../../components/ui/Card.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Toast from '../../components/ui/Toast.jsx';
import Modal from '../../components/ui/Modal.jsx';
import CameraIcon from '../../components/icons/CameraIcon.jsx';

import { useState, useRef } from 'react';

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
    const avatarInputRef = useRef(null);
    const [draftAvatar, setDraftAvatar] = useState(null);
    const [isAvatarEditing, setIsAvatarEditing] = useState(false);
    const [avatarError, setAvatarError] = useState("");

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

    function handleAvatarSelection(event) {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        setAvatarError("");
        
        if (!["image/png", "image/jpeg"].includes(file.type)) {
            setAvatarError("Please choose a PNG or JPEG image.");
            return;
        }

        if (file.size > 1024 * 1024) {
            setAvatarError("Please choose an image smaller than 1MB.");
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            setDraftAvatar(reader.result);
        };

        reader.readAsDataURL(file);
    }

    function handleAvatarSave() {
        const updatedUser = {
            ...user,
            avatar: draftAvatar,
        };
        try {
            localStorage.setItem("mockProfile", JSON.stringify(updatedUser));
            setUser(updatedUser);
            setDraftAvatar(null);
            setAvatarError("");
            avatarInputRef.current.value = "";
            setIsAvatarEditing(false);
        } catch {
            setAvatarError("Could not save your avatar. Try a smaller image.");
        }

    }

    function handleAvatarCancel() {
        setDraftAvatar(null);
        setAvatarError("");
        avatarInputRef.current.value = "";
        setIsAvatarEditing(false);
    }

    function handleCancelEdit() {
        setDraftName(user.name);
        setDraftUsername(user.username);
        setDraftEmail(user.email);
        setUsernameError("");
        setNameError("");
        setIsEditing(false);
    }

    return (
        <main className="mx-auto w-full max-w-5xl p-6">
            <Card>
                <div className="flex md:flex-row flex-col gap-6 md-flex-row">
                    <section className="flex flex-col items-center gap-3 rounded-xl bg-surface-tinted p-6 md:w-1/3">
                                            <div className="relative">
                            <Avatar
                            src={user.avatar}
                            alt="Your profile picture"
                            size="lg"
                            />

                            <button
                                type="button"
                                aria-label="Change avatar"
                                title="Change avatar"
                                className="absolute bottom-1 right-1 rounded-full border-2 border-white bg-primary p-3 text-on-primary shadow-md transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-focus"
                                onClick={() => setIsAvatarEditing(true)}
                            >
                                <CameraIcon/>
                            </button>
                            <Modal
                                title="Change avatar"
                                isOpen={isAvatarEditing}
                                onClose={handleAvatarCancel}
                                >
                                    <Avatar
                                        src={draftAvatar ?? user.avatar}
                                        alt="Avatar preview"
                                        size="lg"
                                    />
                                    <input 
                                        ref={avatarInputRef}
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        onChange={handleAvatarSelection}
                                        hidden
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => avatarInputRef.current.click()}
                                    >
                                        Choose image
                                    </Button>
                                    {avatarError && (
                                        <p role="alert" className="text-center text-sm text-error">
                                            {avatarError}
                                        </p>
                                    )}
                                    {draftAvatar !== null && (
                                        <div className="flex gap-2">
                                            <Button
                                                variant="primary"
                                                type="button"
                                                onClick={handleAvatarSave}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                type="button"
                                                onClick={handleAvatarCancel}
                                                className="rounded-lg bg-secondary px-3 py-2 text-sm text-on-secondary font-semibold hover:bg-secondary-hover"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    )}
                            </Modal>
                        </div>

                        <h1 className="text-4xl font-bold">
                            {user.username}
                        </h1>
                        <p className="text-center text-sm text-muted mb-6">
                            Member since {user.joined}
                        </p>

                        <Button
                            variant="primary"
                            type="button"
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
                        </Button>

                    </section>

                <section className="min-w-0 flex-1 p-4">
                    <h2 className="mb-6 text-2xl font-bold border-b-2 border-b-gray-400 pb-3">
                        Account details
                    </h2>
                    
                    {!isEditing && (
                    <dl className="grid grid-cols-[7rem_minmax(0,1fr)] gap-x-4 gap-y-4 text-lg">

                        <dt className="text-muted">Username</dt>
                        <dd className="font-semibold">{user.username}</dd>

                        <dt className="text-muted">Name</dt>
                        <dd className="font-semibold">{user.name}</dd>

                        <dt className="text-muted">Email</dt>
                        <dd className="font-semibold wrap-break-word">{user.email}</dd>
                    </dl>
                
                    )}
                    <Toast onDismiss={() => setSuccessMessage("")}>
                        {successMessage}
                    </Toast>
                </section>
                <Modal
                    title="Edit profile"
                    isOpen={isEditing}
                    onClose={handleCancelEdit}
                    >
                    <form onSubmit={handleSave}
                        className="grid grid-cols-[7rem_minmax(0,1fr)] gap-x-4 gap-y-4 text-lg">
                        
                        <label htmlFor="username" className="mb-2 block font-medium">
                            Username
                        </label>
                        
                        <Input 
                            id="username"
                            type="text"
                            value={draftUsername}
                            onChange={(event) => setDraftUsername(event.target.value)}
                            aria-invalid={usernameError !== ""}
                            aria-describedby={usernameError ? "username-error" : undefined}    
                        />
                        {
                            usernameError && (
                                <p id="username-error" role="alert" className="col-start-2 text-sm text-error">
                                    {usernameError}
                                </p>
                        )}
                        <label className="mb-2 block font-medium" htmlFor="name">
                            Name
                        </label>

                        <Input
                            id="name"
                            type="text"
                            value={draftName}
                            onChange={(event) => setDraftName(event.target.value)}
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

                        <Input
                            id="email"
                            type="email"
                            required
                            value={draftEmail}
                            onChange={(event) => setDraftEmail(event.target.value)}
                        />

                        <div className="col-span-2 mt-4 flex justify-end gap-3 text-sm">
                            <Button
                            variant="primary"
                            type="submit"
                            disabled={!hasProfileChanged}
                            >
                            Save changes
                            </Button>
                            <Button 
                                variant="secondary"
                                type="button"
                                className="rounded-lg bg-secondary px-4 py-2 font-semibold text-on-secondary hover:bg-secondary-hover"
                                onClick={handleCancelEdit}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Modal>
                </div>
            </Card>
        </main>
    );
}
