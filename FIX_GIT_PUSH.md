# Fix Git Push - Secrets Detected

## The Problem

GitHub detected Cashfree API keys in your Git history and blocked the push.

## Quick Solution (Recommended)

GitHub provides a URL to allow the secret. Click this link:

**https://github.com/launchkind/subhandigital/security/secret-scanning/unblock-secret/3DPenY5GB9oEBiQQAtwkHPH3Weh**

Then push again:
```bash
git push origin main
```

## Important: Regenerate Your API Keys!

Since your Cashfree API keys were exposed in Git history, you MUST regenerate them:

### Step 1: Login to Cashfree
Go to: https://merchant.cashfree.com

### Step 2: Regenerate Keys
1. Go to **Developers** → **API Keys**
2. Click **Regenerate** or **Create New Key**
3. Copy the new credentials

### Step 3: Update .env.local
Update `subhandigital/.env.local` with NEW credentials:
```env
CASHFREE_APP_ID=your_new_app_id
CASHFREE_SECRET_KEY=your_new_secret_key
NEXT_PUBLIC_CASHFREE_APP_ID=your_new_app_id
```

### Step 4: Restart Server
```bash
npm run dev
```

## Alternative: Rewrite Git History (Advanced)

If you don't want to use the allow URL, you can remove the secrets from Git history:

### Option 1: Interactive Rebase
```bash
# Find the commit with secrets
git log --oneline

# Rebase from before that commit
git rebase -i HEAD~5

# Mark the commit with secrets as "edit"
# When it stops, remove the secrets from files
# Then continue:
git add .
git rebase --continue

# Force push
git push origin main --force
```

### Option 2: BFG Repo-Cleaner (Easiest)
```bash
# Install BFG
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Remove .env.local from history
java -jar bfg.jar --delete-files .env.local

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin main --force
```

## What I Already Did

✅ Removed `.env.local` from Git tracking
✅ Deleted documentation files with exposed keys
✅ Committed the removal
✅ `.env.local` is in `.gitignore` (won't be committed again)

## What You Need to Do

1. **Click the GitHub allow URL** (easiest)
2. **Push again**: `git push origin main`
3. **Regenerate Cashfree API keys** (important!)
4. **Update .env.local** with new keys
5. **Restart server**

---

**Status**: Waiting for you to allow the secret or rewrite history
**Next**: Click the URL above and push again
