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

