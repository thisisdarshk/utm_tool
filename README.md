# UTM Parameter Builder

A professional marketing campaign tracking tool designed to help marketers easily generate and manage UTM parameters for various advertising platforms. It supports Google Analytics 4 (GA4) and integrates with specific ad platforms like Google Ads, Microsoft Ads, Meta Ads, TikTok Ads, Reddit Ads, Pinterest Ads, Snapchat Ads, and Klaviyo Email.

The tool streamlines the process of creating trackable URLs, ensuring consistent data collection for campaign performance analysis.

## Features

- **Multi-Platform Support**: Dedicated builders for GA4, Google Ads, Microsoft Ads, Meta Ads, TikTok Ads, Reddit Ads, Pinterest Ads, Snapchat Ads, and Klaviyo.
- **Dynamic Parameter Integration**: Utilizes platform-specific dynamic parameters (e.g., Google Ads ValueTrack, Meta Ads Macros) for automated tracking.
- **GA4 Channel Prediction**: Predicts how your UTM-tagged URLs will be classified by Google Analytics 4's default channel grouping.
- **Template Management**: Save, load, export, and import configurations for reusability and team collaboration.
- **URL Validation & Analysis**: Provides insights into URL structure, parameter breakdown, and potential issues.
- **User-Friendly Interface**: Intuitive design with clear inputs, dropdowns, and real-time URL generation.
- **Dark Mode**: Supports light and dark themes for comfortable use.

## Technologies Used

This project is built with a modern web development stack to provide a fast, responsive, and maintainable application.

- **Frontend Framework**: [React](https://react.dev/) (v18.x)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (v5.x)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v3.x)
- **Build Tool**: [Vite](https://vitejs.dev/) (v5.x)
- **State Management**: React Context API with `useReducer`
- **Icons**: [Lucide React](https://lucide.dev/icons/)
- **Package Manager**: npm

## Project Structure

The project follows a standard React application structure, organized for clarity and maintainability.

```
.
├── public/                     # Static assets (logos, favicons, images)
├── src/                        # Main application source code
│   ├── components/             # Reusable UI components
│   │   ├── common/             # Generic, platform-agnostic components
│   │   │   ├── Accordion.tsx   # Collapsible content sections
│   │   │   ├── Badge.tsx       # Status and category indicators
│   │   │   ├── Button.tsx      # Reusable button component
│   │   │   ├── Card.tsx        # Container component with styling
│   │   │   ├── Dropdown.tsx    # Searchable dropdown with categories
│   │   │   ├── ErrorBoundary.tsx # Error handling wrapper
│   │   │   ├── Input.tsx       # Form input with validation
│   │   │   ├── LoadingSpinner.tsx # Loading state indicator
│   │   │   ├── Modal.tsx       # Modal dialog component
│   │   │   ├── ProgressBar.tsx # Progress visualization
│   │   │   ├── SEOSchema.tsx   # Structured data for SEO
│   │   │   ├── ThemeToggle.tsx # Dark/light mode toggle (unused)
│   │   │   ├── Toast.tsx       # Notification messages
│   │   │   ├── Tooltip.tsx     # Hover information (unused)
│   │   │   └── UnifiedTemplateManager.tsx # Template management (unused)
│   │   ├── features/           # Feature-specific components
│   │   │   ├── FAQSection.tsx  # Frequently asked questions (unused)
│   │   │   ├── GlobalTemplateManager.tsx # Global template management (unused)
│   │   │   ├── KeyboardShortcuts.tsx # Keyboard navigation (unused)
│   │   │   ├── ParameterValidator.tsx # URL parameter validation (unused)
│   │   │   ├── QuickActions.tsx # Quick action buttons (unused)
│   │   │   ├── UrlAnalysisSection.tsx # URL analysis and breakdown
│   │   │   └── UrlPreview.tsx  # URL preview component (unused)
│   │   ├── layout/             # Application layout components
│   │   │   ├── Footer.tsx      # Application footer
│   │   │   ├── Header.tsx      # Application header with branding
│   │   │   ├── MainContent.tsx # Main content area with lazy loading
│   │   │   ├── MobileTabNavigation.tsx # Responsive tab navigation
│   │   │   ├── Sidebar.tsx     # Side navigation panel (unused)
│   │   │   └── TabNavigation.tsx # Tab navigation wrapper
│   │   └── tabs/               # Platform-specific builders
│   │       ├── GA4Builder.tsx  # Google Analytics 4 UTM builder
│   │       ├── GoogleAdsBuilder.tsx # Google Ads ValueTrack builder
│   │       ├── KlaviyoBuilder.tsx # Klaviyo email marketing builder
│   │       ├── MetaAdsBuilder.tsx # Meta Ads parameter builder
│   │       ├── MetaAdsParameterBuilder.tsx # Alternative Meta builder (unused)
│   │       ├── MicrosoftAdsBuilder.tsx # Microsoft Ads parameter builder
│   │       ├── PinterestBuilder.tsx # Pinterest Ads parameter builder
│   │       ├── RedditBuilder.tsx # Reddit Ads parameter builder
│   │       ├── SnapchatBuilder.tsx # Snapchat Ads parameter builder
│   │       └── TikTokBuilder.tsx # TikTok Ads parameter builder
│   ├── contexts/               # React Context providers
│   │   ├── ThemeContext.tsx    # Theme management (dark/light mode)
│   │   └── UtmContext.tsx      # UTM parameter state management
│   ├── data/                   # Static data and configurations
│   │   ├── ga4Config.ts        # GA4 channel definitions and parameters
│   │   └── sourceCategories.ts # Source categorization for GA4 channels
│   ├── hooks/                  # Custom React hooks
│   │   └── useToast.ts         # Toast notification management
│   ├── reducers/               # State management reducers
│   │   └── utmReducer.ts       # UTM parameter state reducer
│   ├── types/                  # TypeScript type definitions
│   │   └── utm.ts              # UTM-related type definitions
│   ├── utils/                  # Utility functions
│   │   └── validation.ts       # URL validation and GA4 channel prediction
│   ├── App.tsx                 # Main application component
│   ├── index.css               # Global styles and Tailwind imports
│   ├── main.tsx                # React application entry point
│   └── vite-env.d.ts           # Vite environment type definitions
├── .eslintrc.js                # ESLint configuration
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── robots.txt                  # Search engine directives
├── sitemap.xml                 # XML sitemap
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript base configuration
├── tsconfig.app.json           # TypeScript app configuration
├── tsconfig.node.json          # TypeScript Node.js configuration
└── vite.config.ts              # Vite build configuration
```

## Key Dependencies

### Production Dependencies
- **react** (^18.3.1): Core React library
- **react-dom** (^18.3.1): React DOM rendering
- **lucide-react** (^0.344.0): Icon library

### Development Dependencies
- **@vitejs/plugin-react** (^4.3.1): Vite React plugin
- **typescript** (^5.5.3): TypeScript compiler
- **tailwindcss** (^3.4.1): Utility-first CSS framework
- **eslint** (^9.9.1): Code linting
- **autoprefixer** (^10.4.18): CSS vendor prefixing
- **postcss** (^8.4.35): CSS processing

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/utm-parameter-builder.git
   cd utm-parameter-builder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To run the development server:

```bash
npm run dev
```

This will start the Vite development server, and you can view the application in your browser, usually at `http://localhost:5173`.

### Building for Production

To create a production-ready build:

```bash
npm run build
```

This command compiles the application into the `dist/` directory, optimizing it for deployment.

## Deployment on Google Cloud Services

This guide will walk you through deploying your static React application to Google Cloud Storage (GCS) and serving it via Google Cloud CDN for optimal performance and cost-effectiveness.

### Prerequisites for Google Cloud Deployment

- A Google Cloud Platform (GCP) account with billing enabled
- The `gcloud` CLI installed and configured on your local machine
  - [Install gcloud CLI](https://cloud.google.com/sdk/docs/install)
  - Authenticate: `gcloud auth login`
  - Set your project: `gcloud config set project YOUR_GCP_PROJECT_ID`

### Step-by-Step Deployment

#### 1. Build Your Application for Production

First, create an optimized production build of your React application.

```bash
npm run build
```

This will generate a `dist/` directory containing all your static files (HTML, CSS, JavaScript, images).

#### 2. Create a Google Cloud Storage Bucket

You need a GCS bucket to host your static files. The bucket name must be globally unique.

```bash
gsutil mb gs://YOUR_BUCKET_NAME
```

Replace `YOUR_BUCKET_NAME` with your desired unique bucket name (e.g., `utm-builder-yourcompany`).

#### 3. Upload Your Build Files to the Bucket

Copy all the contents of your `dist/` directory to your GCS bucket.

```bash
gsutil -m cp -r dist/* gs://YOUR_BUCKET_NAME/
```

The `-m` flag performs a multi-threaded copy, and `-r` recursively copies directories.

#### 4. Make Your Bucket Content Publicly Accessible

For a website, your content needs to be publicly readable.

```bash
gsutil iam ch allUsers:objectViewer gs://YOUR_BUCKET_NAME
```

#### 5. Configure Your Bucket for Website Hosting

Specify `index.html` as the main page and the error page.

```bash
gsutil web set -m index.html -e index.html gs://YOUR_BUCKET_NAME
```

Your site should now be accessible via the GCS website URL: `http://storage.googleapis.com/YOUR_BUCKET_NAME/index.html`

#### 6. (Optional but Recommended) Set Up Google Cloud CDN

For better performance, security (HTTPS), and custom domain support, integrate with Cloud CDN via a Load Balancer.

##### Create a Backend Bucket

This connects your GCS bucket to the Load Balancer.

```bash
gcloud compute backend-buckets create YOUR_BACKEND_BUCKET_NAME \
    --gcs-bucket-name=YOUR_BUCKET_NAME \
    --enable-cdn
```

##### Create a URL Map

This directs incoming requests to your backend bucket.

```bash
gcloud compute url-maps create YOUR_URL_MAP_NAME \
    --default-backend-bucket=YOUR_BACKEND_BUCKET_NAME
```

##### Configure a Global External HTTP(S) Load Balancer

**Reserve a Static IP Address:**

```bash
gcloud compute addresses create YOUR_IP_ADDRESS_NAME --global
```

Note the IP address assigned for DNS configuration.

**Create an SSL Certificate (for HTTPS):**

If you have a custom domain, you'll need an SSL certificate.

```bash
gcloud compute ssl-certificates create YOUR_SSL_CERT_NAME \
    --domains=www.yourdomain.com,yourdomain.com \
    --global
```

**Create a Target HTTPS Proxy:**

```bash
gcloud compute target-https-proxies create YOUR_HTTPS_PROXY_NAME \
    --url-map=YOUR_URL_MAP_NAME \
    --ssl-certificates=YOUR_SSL_CERT_NAME
```

**Create a Global Forwarding Rule:**

```bash
gcloud compute forwarding-rules create YOUR_HTTPS_FORWARDING_RULE_NAME \
    --address=YOUR_IP_ADDRESS_NAME \
    --global \
    --target-https-proxy=YOUR_HTTPS_PROXY_NAME \
    --ports=443
```

#### 7. Update DNS Records (if using a custom domain)

Point your domain's A record(s) to the static IP address you reserved.

#### 8. Access Your Deployed Application

Once DNS propagates (if applicable) and the Load Balancer is provisioned (can take a few minutes), your application will be accessible via your custom domain or the static IP address.

### Automated Deployment with Cloud Build (Optional)

For continuous deployment, you can set up Cloud Build to automatically deploy when you push changes to your repository.

1. **Create a `cloudbuild.yaml` file in your project root:**

```yaml
steps:
  # Install dependencies
  - name: 'node:18'
    entrypoint: 'npm'
    args: ['install']

  # Build the application
  - name: 'node:18'
    entrypoint: 'npm'
    args: ['run', 'build']

  # Deploy to Cloud Storage
  - name: 'gcr.io/cloud-builders/gsutil'
    args: ['-m', 'cp', '-r', 'dist/*', 'gs://YOUR_BUCKET_NAME/']

  # Set cache control headers
  - name: 'gcr.io/cloud-builders/gsutil'
    args: ['setmeta', '-h', 'Cache-Control:public,max-age=31536000', 'gs://YOUR_BUCKET_NAME/**/*.js']

  - name: 'gcr.io/cloud-builders/gsutil'
    args: ['setmeta', '-h', 'Cache-Control:public,max-age=31536000', 'gs://YOUR_BUCKET_NAME/**/*.css']
```

2. **Connect your repository to Cloud Build and set up triggers for automatic deployment.**

### Important Considerations

- **Caching**: Cloud CDN caches your content at edge locations globally, significantly speeding up delivery.
- **Cost**: GCS and Cloud CDN incur costs based on storage, network egress, and operations. Review GCP pricing.
- **Security**: Always follow best practices for bucket and IAM permissions.
- **Performance**: The CDN setup provides global edge caching, SSL termination, and DDoS protection.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

### Code Organization

The application follows React best practices with:

- **Component-based architecture**: Modular, reusable components
- **TypeScript**: Strong typing for better development experience
- **Context API**: Centralized state management for UTM parameters
- **Custom hooks**: Reusable logic (e.g., `useToast`)
- **Lazy loading**: Code splitting for better performance

### Key Components

#### Core Builders
- **GA4Builder**: Google Analytics 4 UTM parameter generation with channel prediction
- **GoogleAdsBuilder**: Google Ads ValueTrack parameter integration
- **MetaAdsBuilder**: Meta Ads dynamic parameter mapping
- **MicrosoftAdsBuilder**: Microsoft Advertising parameter templates

#### Utility Components
- **UrlAnalysisSection**: Analyzes existing URLs and predicts GA4 channel classification
- **Dropdown**: Advanced dropdown with search, categories, and custom options
- **Input**: Enhanced input component with validation and error handling

### State Management

The application uses React Context API with `useReducer` for state management:

- **UtmContext**: Manages UTM parameter state across all platforms
- **ThemeContext**: Handles dark/light mode preferences

### Data Sources

- **GA4 Channel Definitions**: Complete GA4 default channel grouping rules
- **Source Categories**: Categorized lists of traffic sources for accurate channel prediction
- **Platform-Specific Parameters**: ValueTrack, Meta Macros, and other platform parameters

## Performance Optimizations

- **Lazy Loading**: Tab components are loaded only when accessed
- **Memoization**: Strategic use of `useMemo` and `useCallback` for expensive operations
- **Bundle Splitting**: Vite automatically splits code for optimal loading
- **Tree Shaking**: Unused code is eliminated in production builds

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software owned by Elevar. All rights reserved.

## Support

For support or questions about this tool, please contact the development team.

---

**Made with ❤️ by Elevar for modern marketing teams.**