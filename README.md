- Cookies: Session and Persistent (maxAge in milliseconds, 1 second = 1000ms)

- Implement Refresh Tokens

- Rate limit Login Attempts (npm i express-rate-limit)

- Move JWT creation to a Utility function

- Utility function files: generateRefreshToken, generateAccessToken

- Store Refresh Token in Redis (for Logout & Invalidation)

- Validate Input Using Joi

### Why do we need to "blacklist" a token? / Blacklisting token using Redis

- JWTs cannot be deleted. Once you give a user a refresh token (valid for 7-30 days), it is valid until it expires.

So, if the user logs out:

    You cannot "delete" a JWT
    You cannot force-expire it
    You cannot change its expiry

The token will still work even after logout. This is a security problem.

- Solution: Token Blacklisting

When a user logs out: Instead of "deleting" the JWT (which is impossible), we save the token in Redis and mark it as: "blacklisted"

Then every time a refresh token is used, we check in Redis:

    Is this refresh token blacklisted?

If yes -> reject it.
If no -> allow refreshing the access token

### Why is deleting a JWT impossible?

Because: JWTs are stateless and self-contained. Once a JWT is issued, it contains:

    userId, expiry date, signature

And the server doesn't store it anywhere. So, the server has:

    - No record of the token
    - No way to "find it"
    - No way to "delete it"
    - No way to invalidate it before expiry

The client already has the token, and the server has no control over it.

### Questions to ASK when learning new technologies?

- What are the REAL WORLD problems this tech solves?

- What are the limitations or weaknesses?

- How do companies handle this in PRODUCTION?

- What are common security issues and how to fix them?

- What patterns or architectures are normally used with this tech?

- What would break if I don't handle something properly?

- How do large-scale systems do this at million of users?

## WHERE should the actual video file be uploaded?

If you store videos directly in DB, then DB size explodes, Queries becomes slow, Backups take forever, Scaling becomes impossible, We pay huge cloud costs.

    So, never store videos or images in MongoDB. Store only the URL in MongoDB.

1. Cloud storage providers

   These are designed to handle large media files, streaming, CDNs, etc.

   Services: AWS S3, Cloudinary, Firebase Storage, Supabase Storage, GCP

Frontend > S3/Cloudinary (upload) > Gives URL > Send URL to backend > Store URL in DB

## How File Uploads Work

- When we upload a file:

  Frontend: Uses <input type="file">, Sends file via FormData, Request type: multipart/form-data

  Backend: Cannot read file directly (because it's a binary stream), Needs middleware like multer to parse the file

- Cloud Storage (Recommended for Production)

  AWS S3, Cloudinary, Firebase Storage, Supabase Storage

- Security Best Practices

  Validate file type, Limit file size

## Why you should NOT store uploads inside your backend server

1. Server will become heavy: image & videos take larger space > server becomes slow > deployment cost increases

2. Scaling becomes impossible: If you scale your backend to multiple instances

   Instance A has uploads
   Instance B does NOT
   Files become inconsistent

3. When you redeploy -> uploads folder gets deleted. All user files get removed.

4. CDN not available. Images/videos load slower without global CDN.

## Use Presigned URLs for upload

This means: frontend uploads directly to cloud. Backend NEVER touches the file

This is the MOST scalable & fastest method used by YouTube, Netflix, Zomato, Swiggy.

- The problem with normal uploads

  Frontend -> Backend -> Cloud Storage

  Backend receives the file -> stores -> uploads -> responds

Issues: Backend memory used, Slow, Costs increases, Limits scaling, Backend becomes bottleneck

- Presigned URL Flow:

  Frontend -> Cloud Storage (DIRECT)

  Backend -> only gives a signed permission link

**How it works?**

- Step 1: Frontend asks Backend - I want to upload a file. Give me permission.

- Step 2: Backend creates a temporary S3/Cloudinary upload URL

  This URL has: an expiry time, allowed file type, allowed size, path (folder/filename)

- Step 3: Frontend uploads directly to cloud

  Backend never receives the file. Cloud storage handlles it directly.

**Why presigned URLs are used by YouTube, Netflix, Instagram, Zomato, Swiggy?**

- Backend CPU remains free: File uploading is heavy -> backend avoids that work

- Faster uploads (CDN-accelerated)

- Horizontal scaliing becomes easier: Even if backend has 20 servers, file upload logic stays same.

## Validate file type (MIME type) - Multipurpose Internet Mail Extensions

It describes the format of a file. This ensures you only allow safe file types.

- When user uploads a file: Browser sends MIME inside request.

- Why important? Prevents dangerous uploads.

  Someone may upload .exe pretending it's .png

  Helps Cloud storage treat file correctly.

## Use Streaming for large videos

- Never load big videos into memory.. Use streams so server does NOT crash.

- Traditional (BAD) Method: Download entire video first

  Imagine watching Netflix like this:

  - You must download the Full 5GB movie
  - Then video starts playing after full download
  - RAM usage = full file loaded in memory
  - Server must send entire file at once

- Streaming (GOOD) Method: Only load small pieces/chunks

  Streaming = sending file in small chunks/parts

  Example: Movie (5GB), Chunk Size=1MB

        Laptop requests only: Chunk 1, Chunk 2, Chunk 3, etc

  Server never loads whole fi.e Only loads the next chunk

## Use a CDN (Content Delivery Network)

- Cloudinary, S3 + CloudFront, Firebase

- CDN stores your images, videos, files in servers worldwide

- users get the file from the nearest server

- gives lightning-fast speed, reduces load on backend, reduces cloud costs

Example: If you deploy on AWS Mumbai. But user is in Canada -> slow

    CDN copies your video to Canada -> fast.

## Why console statements not in PRODUCTION?

## Understanding Video Uploads, Buffers & Scalable Upload Architecture

- Problem: Video uploads are slow (3-4 seconds)

  When uploadng a 20-25MB video, your backend takes around 3.5 seconds to finish the request.

  Question:

        Why does Multer take time?

        What is a buffer?

        How does video uploading work behind the scenes?

        Why do big companies use signed URLs instead of uploading through the backend?

## How Video Upload Works Behind the Scenes

When a user uploads a video:

- Step 1 - Frontend sends the file via FormData: The browser sends the video file as binary bytes

- Multer processes the file: reads the entire file, loads it into RAM, stores it in a property: req.file.buffer

  req.file.buffer = <Buffer 00 01 02 03 ...>

  This is the actual binary data of the video.

- What is a Buffer?

  A Buffer is a Node.js data type that stores raw binary data.

  Why do we need it?

        - Images/videos are NOT text
        - They consist of binary bytes (0s and 1s)

        - You cannot store or manipulate them as Strings

        So the file is turned into Buffer like:

            <Buffer 00 00 01 20 66 74 ...>

        This buffer is then given to ImageKit, S3, Cloudinary, etc.

  - Upload speed depends on: server bandwidth, cloud location and video size.

## Why this does NOT scale for many users

If 1000 users upload videos at the same time:

- Problem 1 - Backend becomes bandwidth bottleneck

  Each upload: Client -> Node -> ImageKit

  All traffic goes THROUGH your server.

- Problem 2 - Node RAM shoots up

  Multer stores file in memory

- Problem 3 - Slower uploads

  Your server upload speed is shared between all users.

## How Big Companies Solve This: Direct Upload with Signed URLs

- Instead of this: Client -> Node -> ImageKit

- Use this: Client -> ImageKit directly

Node's job become only: Create a signed URL, Save the final file URL in DB, Node doesn't handle video bytes

**Signed Upload Flow**

- Step 1: Frontend requests a signed URL

      POST /api/get-upload-url

      Backend returns:

        {
            uploadURL: "https://ik.imagekit.io/....",
            token: "...",
            expiry: 1698347839,
            signature: "..."
        }

- Step 2: Frontend uploads the video directly to ImageKit

- Step 3: Frontend sends the final file URL to backend

Backend only stores: name, description, video URL, food partner ID

    No video byte ever touches your Node server.

## DAO File - Data Access Object

DAO is a file that handles all communication between the server and database. It's a pattern used in backend development that:

- Organizes how your server talks to the database

- Separates database logic from controller logic

- Makes code maintainable and clean

### Design a web/app that works offline and syncs data when the user comes online.

Additional Challenges:

- Multiple users may edit the same time -> conflict handling

- User stays offline for a long time -> local storage + sync strategy

- Real-world use cases -> collaboration apps, notes, field apps

This is a classic "Offline-First Architecture" / PWA sync system desing question

- **High-Level Architecture**

Frontend (Offline-first)
⬇
Local Database (IndexedDB / SQLite / Realm)
⬇
Sync Manager
⬇
Backend API (Versioning + Conflict Resolver)
⬇
Cloud Database


- **How does the app work offline?** 

  Use a local database on the device: 

    - Web -> IndexedDB 
    - Mobile -> SQLite/Realm
    - Desktop -> Local Storage + file cache 

  Everything the user does is saved locally: 

    - Create item, Edit item, Delete item 

  All actions are stored in a local "Sync Queue" 


- **How does sync work when online returns?** 

When network is back: The app sends 

1. Unsynced Operations (Create, Update, Delete)

2. Each operation contains: itemId, operationType, payload, lastUpdatedAt timestamp, deviceId 

  Backend processes them one-by-one and responds with results. 

  Frontend updates local DB and clears synced operations. 


3. **What if multiple users edit the same item?**

This is the tricky part - iinterviweres test your conflict resolution knowledge 

You mention one of these strategies: 

- Last Write Wins (LWW): 

  Backend stores: lastUpdatedAt, lastUpdatedBy 

  The latest timestamp overwrites previous. 

  Pros: Simple. Cons: Users may lose data

- Merge Strategy (Google Docs Style)

    If two users edit different parts -> merge automatically 

    If same field -> raise conflict dialog 

    Used in: Google Docs, Figma, Notion 

- Ask user to choose (Manual conflict resolution)

  If backend detects conflict: 

    Your version: 
    Server version: 

    Choose which one to keep. 

    Used in: Git, Note apps 


4. **What if the user stays offline for a long time?** 

- Keep storing data locally (IndexedDB/SQLite supports large offline storage)

- Keep storing operations in "Sync Queue" indefinitely 

- Sync in batches when online 

- Local storage cleanup after sync 


5. Real-World Scenarios

| App Type                                | Why Offline                       |
| --------------------------------------- | --------------------------------- |
| **Google Docs / Sheets**                | Work offline → Sync when online   |
| **Notion / Evernote**                   | Notes created offline             |
| **WhatsApp**                            | Sends messages later when online  |
| **Field apps (Delivery, Construction)** | Workers in areas with no internet |
| **E-commerce carts**                    | Cart updated offline              |



## User Double Clicks the Pay Button - How do you STOP duplicate API Calls 


Users double-clicking buttons can trigger duplicate API calls, which can cause double payments, double submissions, or inconsistent state. 

- Problem: User clicks "Pay" button. First API call is sent. Before it completes, user clicks again. Second API call is sent -> duplicate transaction. 

- Consequences: Double charges. Duplicate records in DB. Confusing UI feedback. 

- Solutions: 

1. Frontend: Disable the button imeediately after the first click and re-enable it only after API responds (success/error)

  Pros: Easy, immediate feedback
  Cons: Only protects the client; if API is called by multiple tabs/devices, duplicates can still happen 

2. Backend: Idempotency Keys 

  Backend can ignore duplicate requests using a unique "idempotency key" sent from frontend. 

  Many payment providers (Stripe, PayPal) rely on this. 

  Pros: Safe against multiple clicks and multiple devices 

  Cons: Requires backend implementation and storage for keys 


3. Debounce/Throttle Clicks: Use debouncing to limit how frequently an action can fire. 

  const handleClick = debounce(async () => {
    await pay() ; 
  }, 1000)

  
  Simple but still doesn't guarantee backend safety. 


4. Backend: Transaction/DB-Level Safety 

  Ensure database enforces uniqueness: Example - Only allow one payment per order ID 

  Even if API is called multiple times, duplicates are rejected 

  Pros: Most reliable, prevents duplicates even if frontend fails. 

  Cons: Requires proper DB design and constraints


**Recommended Approach:**

- FRONTEND: Disable button immediately or show loading state 

- BACKEND: Implement idempotency (key) and DB-level safety 

- OPTIONAL: Use debounce for extra protection on fast clicks 

  Combining frontend + Backend solutions is industry standard, especially for payments. 



## Rendering Optimization 


Rendering optimization refers to techniques used to reduce unnecessary re-renders or repaints in the browser, improving: 

  Performance (faster load and interaction) ; Responsiveness (smoother UI) ; Batter/memory usage (especially important for mobile devices)

Every time a component re-renders, the browser: 

1. Runs JavaScript to calculate what changed
2. Updates the Virtual DOM (in React) or DOM tree
3. Updates the actual DOM 
4. Repaints/reflows the screen 

Unnecessary renders make apps slow, especially for large or dynamic UIs. 

**Why It Happens**

- State Changes: A state update triggers a re-render 

- Props Changes: Passing new props to child components triggers re-render 

- Parent re-renders: Even if child props didn't change, child may re-render 

- Complex Component trees: Deep nesting amplifies cost 


**Key Techniques for Optimization**

1. React Memoization 

  React.memo() prevents re-renders if props didnt change

2. useCallback & useMemo 

  memoizes functions and expensive calculations to avoid unnecessayr re-renders in children 

3. Virtualization / Windowing 

  Only render visible items in long lists (React-Window, React-Virtualized)

  Example: Rendering 10,000 items instead of 10 on screen is wasteful 

4. Code-Splitting & Lazy Loading 

  Split bundles using "React.lazy" and "Suspense" to load only what user sees. 

  Reduces initial load time. 

5. Avoid Unnecessary DOM Manipulation 

  Minimize changes to the DOM. Batch updates if possible 

6. Key Prop Usage 

  In lists, always provide stable keys to help React reuse components instead of re-creating them 

7. Avoid State Overuse 

  Don't put everything in state; derived values can be computed instead. 

  Too many state updates -> more re-renders 


**Rendering Optimization is all about:**

- Reducing unnecessary updates
- memoization (React.memo, useMemo, useCallback)
- Virtualization for large lists 
- Code splitting/lazy loading
- Efficient state and prop management 


## How Browsers Render Webpages (Rendering Pipeline)


- Step 1: HTML -> DOM (Document Object Model)

  Browser parses HTML token by token 

  Creates a tree structure -> DOM tree

- Step 2: CSS -> CSSOM (CSS Object Model)

  Browser parses CSS files and inline styles 

  Creates CSSOM tree 

- Step 3: Browser creates Render Tree describing Visual layout 



## Update Email API - Handling Concurrency (Multiple Users Updating Same Email)


If multiple users attempt to update their email at the same time, we must prevent: 

  Duplicate emails, Partial updates, Race conditions 

1. Database-Level Constraints 

Add a unique constraint on the email field 

  email: {
    type: String, 
    unique: true, 
    required: true 
  }

  This guarantees: Even if two requests hit at the same time, only one succeeds. The second gets a duplicate key error 

  Database-level locking is the strongest protection. 

2. Extra Protection - Optimistic Locking (Version Control), Pessimistic Locking 


  - Optimistic locking: MongoDB documents support a "_v" field. We can enforce: 

    Only update if version matches. Prevent overwriting stale data. 

  - Pessimistic locking: Like SQL transactions: "Lock user row while updating" 

  MongoDB has transations too. Used in highly critical systems. 



## System Design + Distributed Systems + High-Level Backend Engineering 

- Concurrency 
- Race conditions 
- Optimistic/Pessimistic Locking 
- Offline Sync 
- Conflict Resolution
- Idempotency 
- Caching
- Eventual Consistency 
- Replication 
- Atomic Operations 
- Consistency models
- Distributed transactions 
- Scalability 
- Rate limiting 
- Load balancing 
- Queues
- sync/async pipelines

These are NOT tied to any one technology. They are pure software engineering + system design fundamentals. 

**WHERE to get these types of Questions**

- System design interview questions for beginners 

- Backend Engineering Interview Questions 

- Distributed Systems Interview Questions

- Database Concurrency Questions 

- High-level Design Scenario 


## 1. Two users try to update the same document at same time - how do you prevent conflicts? 

Concepts: 

  - Optimistic locking
  - Version numbers
  - Last-Write-Wins
  - Database transactions 

## 2. User double-clicks "BUY NOW" - how do you prevent duplicate payment? 

Concepts: 

  - Idempotency keys 
  - deduplication 
  - transaction isolation levels
  - distributed locks 

## 3. User uploads a 5GB video - how do you handle uploads without crashing server? 

Concepts: 

  - Streams
  - Signed URLs
  - Chunked Uploads
  - Resumable uploads 
  - backpressure 

## 4. User uses app offline and make changes - how do you sync when online? 

Concepts: 

  - Offline-first architecture
  - Vector clocks
  - CRDTs
  - Merge conflicts 
  - Optimistic UI 

## 5. A million users send requests at the same time - how do you protect database? 

Concepts: 

  - Load balancing 
  - caching 
  - rate limiting 
  - eventual consistency 
  - queues (Kafka, RabbitMQ)

## 7. User updates their password - how do you prevent session hijacking? 

Concepts: 

  - JWT Invalidation 
  - Session rotation 
  - Token revocation 
  - Refresh token store 

## 8. Two admins try to update product inventory - how do you avoid negative stock? 

Concepts: 

  - Optimistic/pessimistic locking 
  - Atomic operations 
  - Transactions with ACID 