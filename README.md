# Getting Started

### Features: 

  - Realtime cursors with socket.io deployed on railway.com
  - Realtime text-selection
  - Realtime database and collaboration
  - Move to Trash, delete from Trash, restore from Trash
  - Custom emoji picker for Workspace, folder, file logo
  - Light and Dark mode included
  - Nextjs 14 App router.
  - Payment portal with Stripe.
  - Custom email verifications.
  - Supabase Row level policies.
  - Custom Rich text editor
  - Socket.io
  - Responsive design

  ### Tech-stack using in the project:

  - Drizzle ORM - interacting with database.
  - Postgres database with supabase
  - Next.js 14
  - Typescript
  - UI libary with shadcn-ui
  - Payment gate with Stripe
  - Quill - rich text editor for React
  - socket.io : handling realtime features.

  ### Learning:
    - Handling realtime features with socket.io.
    - Optimistic update: Updating UI states before performing a mutation. Users would experience updates immidiately. If the mutation fails however, an error message will popup and changes will be rolled back. This provides a better user experience when using the app.
    - Handling complicated states in React using appReducer.
    - Drizzle ORM syntax, migration and types.
    - Supabase, postgres database, realtime database changes.

  ### Deployment:
  - Vercel (socket.io is not compatible with vercel. Will implement Pusher for  realtime with Vercel soon)
     [https://note-app-pi-nine.vercel.app/](https://note-app-pi-nine.vercel.app/)

  - Railway (currently experiencing problem on connection between supabase and  railway. Local host working just fine)

    [https://notion-clone-production-90f7.up.railway.app/](https://notion-clone-production-90f7.up.railway.app/)





