# Firebase admin scripts

This folder is excluded from sensitive files by .gitignore.

## Setup

1) Copy your service account key file here and name it:

```
serviceAccountKey.json
```

2) Install dependencies:

```
npm init -y
npm install firebase-admin
```

3) Run the script:

```
node setAdmin.js
```

Do not commit the service account key.
