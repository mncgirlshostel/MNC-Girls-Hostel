# MNC Girls Hostel Website

This website is built with React, Vite, and Tailwind CSS.

## 🚀 How to make it live on GitHub Pages

If your website at `mncgirlshostel.github.io` is not showing live, please follow these 3 simple steps:

### 1. Enable GitHub Actions Deployment
1. Go to your repository on GitHub.
2. Click on **Settings** (top menu).
3. Click on **Pages** (left sidebar).
4. Under **Build and deployment** > **Source**, change the dropdown from "Deploy from a branch" to **GitHub Actions**.

### 2. Verify Actions Permissions
1. In **Settings**, go to **Actions** > **General**.
2. Scroll to **Workflow permissions**.
3. Select **Read and write permissions**.
4. Click **Save**.

### 3. Check the Build Progress
1. Click the **Actions** tab at the top of your GitHub repository.
2. You will see a workflow named **"Deploy static content to Pages"**.
3. If it failed (Red X), click on it to see the error. If it succeeded (Green check), your site is live!

---

**Note:** The `.github/workflows/deploy.yml` file I created handles the entire build process (compiling React to HTML/CSS). You don't need to manually upload the `dist` folder.
