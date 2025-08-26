# Google Cloud Run Deployment Setup

This guide helps you set up automatic deployment to Google Cloud Run via GitHub Actions.

## Prerequisites
- Google Cloud Project with billing enabled
- Cloud Run API enabled
- Container Registry API enabled

## Setup Steps

### 1. Create Service Account
```bash
# Set your project ID
export PROJECT_ID=your-project-id

# Create service account
gcloud iam service-accounts create basecamp-deployer \
  --description="Service account for basecamp deployment" \
  --display-name="Basecamp Deployer"

# Grant necessary permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:basecamp-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:basecamp-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:basecamp-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

### 2. Create Service Account Key
```bash
# Generate key file
gcloud iam service-accounts keys create basecamp-key.json \
  --iam-account=basecamp-deployer@$PROJECT_ID.iam.gserviceaccount.com

# Copy the contents of basecamp-key.json for the next step
cat basecamp-key.json
```

### 3. Set GitHub Repository Secrets

Go to your repository: https://github.com/sanpixel/basecamp

**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these secrets:

1. **GCP_PROJECT_ID**
   - Value: Your Google Cloud Project ID

2. **GCP_SA_KEY** 
   - Value: The entire contents of `basecamp-key.json` file

### 4. Trigger Deployment

Once secrets are configured, push any commit to master branch:

```bash
git commit --allow-empty -m "Trigger deployment"
git push origin master
```

## Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
# Build and push
docker build -t gcr.io/$PROJECT_ID/basecamp-dashboard:latest .
docker push gcr.io/$PROJECT_ID/basecamp-dashboard:latest

# Deploy to Cloud Run
gcloud run deploy basecamp-dashboard \
  --image gcr.io/$PROJECT_ID/basecamp-dashboard:latest \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10 \
  --platform managed
```

## Custom Domain Setup

After deployment, set up custom domain:

```bash
# Map domain to Cloud Run service
gcloud run domain-mappings create \
  --service basecamp-dashboard \
  --domain basecamp.clocknumbers.com \
  --region us-central1
```

Then update DNS records as instructed by the output.

## Troubleshooting

- **Authentication errors**: Verify service account permissions
- **Build failures**: Check Dockerfile and dependencies
- **Deploy failures**: Ensure Cloud Run API is enabled
- **Domain issues**: Verify DNS configuration and SSL certificates

## Expected Result

Once deployed successfully:
- **Service URL**: https://basecamp-dashboard-[hash]-uc.a.run.app
- **Custom Domain**: https://basecamp.clocknumbers.com (after DNS setup)
- **Auto-deployment**: On every push to master branch
