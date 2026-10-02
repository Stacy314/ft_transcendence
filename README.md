# ft_transcendence
This project has been created as part of the 42 curriculum by <login1>, <login2>, <login3>, <login4>[, <login5>].

Tamagotchi Online
Description

Tamagotchi Online is a real-time multi-user web application where every player raises a virtual pet. Pets get hungry, tired, bored and dirty over time; players keep them alive by feeding, playing, cleaning and putting them to sleep. Players can befriend others, visit their pets, chat, and earn achievements.

Goal: build a polished, real-world web app (frontend, backend, database, Docker deployment) that demonstrates teamwork and the technical requirements of ft_transcendence.

Key features

Secure sign up / login (email + password, OAuth 2.0), profile & avatar
Create, name and customize a pet; pet needs decay in real time
Care actions: feed, play, clean, sleep, heal; pet evolution stages
Real-time updates and online status via WebSockets
Friends system, user profiles, direct chat
Gamification: achievements, XP/levels, leaderboard
In-app notifications (e.g. "Your pet is hungry")
Multi-language UI (EN / FR / UK), installable PWA
Privacy Policy and Terms of Service pages
Instructions
Prerequisites
Docker and Docker Compose (v2+)
Latest stable Google Chrome
Git
Setup
bash
git clone <repository-url> && cd <repository>
cp .env.example .env     # fill in the values (see below)
make up                  # or: docker compose up --build

Then open https://localhost:<PORT> (self-signed certificate: accept the warning).

Environment variables (.env)
Variable	Description
DATABASE_URL	PostgreSQL connection string
JWT_SECRET	Secret for signing tokens
OAUTH_CLIENT_ID / OAUTH_CLIENT_SECRET	OAuth provider credentials
FRONTEND_URL / API_URL	Public URLs

.env is git-ignored; never commit real secrets.

Team Information
Member	Role(s)	Responsibilities
<login1>	Product Owner + Developer	Product vision, backlog, feature priorities, validating completed work
<login2>	Project Manager + Developer	Meetings, deadlines, risks, communication
<login3>	Technical Lead + Developer	Architecture, stack decisions, code review
<login4>	Developer	<frontend / backend areas>
<login5>	Developer	<areas>
Project Management
Organization: work split into epics → tasks; weekly planning + short syncs; every task reviewed via Pull Request by at least one other member.
Tools: Jira (backlog, sprints), GitHub (code, PRs).
Communication: Discord / Slack.
Technical Stack
Frontend: React + TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Zustand, socket.io-client, i18next.
Backend: NestJS (Node.js), socket.io gateway, Prisma ORM.
Database: PostgreSQL — relational data (users, pets, friendships) with clear relations and transactions for concurrent actions.
Other: Docker Compose, HTTPS reverse proxy (Nginx), Workbox (PWA).
Justification: one language (TypeScript) across the stack, strong ecosystem, easy real-time support, type-safe DB access.
Database Schema

Replace with a diagram (e.g. dbdiagram.io) and finalize fields.

Table	Key fields	Relations
users	id, email, password_hash, username, avatar_url, role, created_at	1—N pets, N—N friends
pets	id, owner_id, name, species, stage, hunger, happiness, energy, hygiene, health, last_tick_at	N—1 users
pet_actions	id, pet_id, type, created_at	N—1 pets
friendships	id, user_id, friend_id, status	N—1 users (x2)
messages	id, sender_id, receiver_id, content, created_at	N—1 users (x2)
achievements / user_achievements	id, code, title / user_id, achievement_id, unlocked_at	N—N users
notifications	id, user_id, type, payload, read, created_at	N—1 users
Features List
Feature	Description	Team member(s)
Authentication	Sign up, login, OAuth, validated forms	<...>
Pet creation & customization	Choose species/name/appearance	<...>
Pet care & evolution	Feed/play/clean/sleep, stat decay, stages	<...>
Real-time sync	Live stats, online status	<...>
Friends & profiles	Add/remove friends, view pets	<...>
Chat	Real-time direct messages	<...>
Gamification	Achievements, XP, leaderboard	<...>
Notifications	In-app and push-style alerts	<...>
i18n & PWA	3 languages, installable app	<...>
Legal pages	Privacy Policy, Terms of Service	<...>
Modules
Module	Type	Points	Justification / implementation	Owner(s)
Frontend + backend frameworks	Major	2	React + NestJS	<...>
Real-time features (WebSockets)	Major	2	Live pet state, presence, chat	<...>
Standard user management	Major	2	Profile, avatar, friends, online status	<...>
User interaction (chat, profile, friends)	Major	2	Social layer around pets	<...>
Gamification system	Minor	1	Achievements, XP/levels, leaderboard	<...>
ORM	Minor	1	Prisma	<...>
Notification system	Minor	1	Events on create/update/delete	<...>
Multiple languages (3+)	Minor	1	i18next, EN/FR/UK	<...>
OAuth 2.0	Minor	1	Google/GitHub/42 login	<...>
PWA	Minor	1	Installable, offline shell	<...>
Total		15	1 point buffer in case a module is not validated	
Individual Contributions
<login1>
Features/modules: ...
Challenges and solutions: ...
<login2>
...

(Repeat for every team member.)

Resources
React, Vite, NestJS, Prisma, socket.io, i18next, Workbox documentation
WCAG 2.1 guidelines, OWASP password storage cheat sheet
Tutorials/articles: <add links>

AI usage: <describe which tasks AI was used for (e.g. brainstorming, boilerplate, debugging, documentation) and which parts of the project; all AI-generated code was reviewed and understood by the team.>

Known Limitations
<add>
License
<add>
