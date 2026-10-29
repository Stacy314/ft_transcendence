import './style.css';
import avatar from '../../assets/orange_beanie_avatar.png';
import { Camera, Pencil } from "lucide-react";
import { useState } from 'react';

export default function Profile() {
    return (
        <main className="profile-page">
            <header className="profile-header">
                <img className="profile-avatar" src={avatar} alt="user's avatar" />
                <h1 className="profile-user">janedoe1</h1>
            </header>

            <hr className="divider" />
            <section className="profile-details">
                <h2 className="account-details">Account details</h2>
                <dl>
                    <dt>Username</dt>
                    <dd>janedoe1</dd>
                    <dt>Name</dt>
                    <dd>Jane Doe</dd>
                    <dt>Email</dt>
                    <dd>example@example.com</dd>
                </dl>
            </section>
            <button type="button" className="edit-profile">
            Edit profile
            </button>
        </main>
    );
}
