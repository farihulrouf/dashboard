# Klassiq

A Platform where you can study anything in Real Time

# How to Start Developing

1. Clone the repo
1. Install with `npm install`
1. Run with `npm run dev`

If you're on Windows, you might need to use `npm-run-all` and change your the *scripts section* in `package.json` similar to the code below:

```
{
    ...
    "scripts": {
        ...,
        "dev": "run-p dev1 dev2", // run dev1 and dev2 in parallel
        "dev1": "nodemon server/notifconsumer.js",
        "dev2": "nodemon server/app.js --watch server",
        ...
    }
}
```

# Runtime Dependencies

You'll need the following programs to run the app
- Node.js
- npm (Node Package Manager)
- MongoDB
- RabbitMQ

# Environment Variables

You'll need to configure some environment variables to open your base url e.g. http://localhost:3000/. Example environment varaible can be seen below:

```
filename: .env

file contents:
MONGO_URI=mongodb://localhost:27017
SESSION_SECRET=keyboard cat
```

# Epilogue

With everything set, you should now be able to open the base URL and you will open the homepage of the website. Quick reminder, the base URL is equivalent to `/index` which is contained in `pages/index.js`.

# Required Knowledge

To develop this site fluently, you should be familiar with:
1. Next.js
1. React.js
1. MongoDB
1. RabbitMQ
