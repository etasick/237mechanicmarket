# 237Mechanic Marketplace

### A digital marketplace for vehicles and automotive products in Cameroon

237Mechanic Marketplace** is a full-stack web marketplace designed for the Cameroonian automotive market.

The platform provides a foundation for a broader automotive technology ecosystem, beginning with vehicle listings and designed to support additional services around automobiles, motorcycles, spare parts, automotive services, charging infrastructure and other mobility-related products and services**.

Live Application:** https://237mechanicmarket.vercel.app/

GitHub:** https://github.com/etasick/237mechanicmarket

---

## Project Overview

237Mechanic was created to address the difficulty of discovering and managing automotive listings in the Cameroonian market through a dedicated digital marketplace.

The application provides a modern web interface through which users can interact with vehicle listings while the underlying application architecture handles authentication, data management, media processing, internationalization and cloud services.

The project is also an example of building and deploying a real-world software product rather than a purely academic demonstration.

---

## Key Features

* Automotive marketplace
* Vehicle listing and discovery
* User authentication
* Cloud-backed application architecture
* Image upload and image compression
* GraphQL-based data access
* Internationalization
* Responsive user interface
* SEO support
* Sitemap generation
* Client-side and server-side API integration
* Cloud-hosted deployment
* Structured application architecture
* Support for multiple automotive categories and future marketplace expansion

---

# Technology Stack

## Frontend

* **Next.js 14**
* **React 18**
* Tailwind CSS
* Chakra UI
* Styled Components
* Framer Motion
* Heroicons
* Lucide React

## Cloud & Backend

* **AWS Amplify**
* AWS Amplify UI
* GraphQL
* AWS service integrations
* Firebase
* Sanity

## Application & API

* Axios
* Node Fetch
* GraphQL
* AWS request signing / `aws4fetch`

## Internationalization

* `next-intl`
* `i18next`
* `react-i18next`
* Browser language detection

## Media

* React Dropzone
* Browser Image Compression
* File Saver

## SEO & Web

* Next SEO
* Sitemap generation
* Responsive design

---

# Architecture

The application is built around a modern Next.js architecture with cloud services providing backend functionality.

At a high level:

```text
                         ┌─────────────────────┐
                         │       Users         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Next.js        │
                         │   React Frontend    │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┼────────────────┐
                    │               │                │
                    ▼               ▼                ▼
              Authentication    GraphQL/API     Content Services
                    │               │                │
                    ▼               ▼                ▼
              AWS Amplify       Cloud Backend    Sanity/Firebase
                                    │
                                    ▼
                              Application Data
```

The application separates the presentation layer from cloud-backed services and API/data operations, allowing the platform to evolve as additional marketplace functionality is introduced.

---

# AWS & Cloud Integration

AWS Amplify forms an important part of the application's cloud architecture.

The repository includes:

* `aws-amplify`
* AWS Amplify UI
* GraphQL configuration
* AWS request tooling

This provides practical experience with:

* Cloud authentication
* Cloud APIs
* GraphQL
* Managed backend services
* Application configuration
* Cloud-integrated frontend development

The project demonstrates how a web application can use managed cloud services instead of maintaining every backend component manually.

---

# Authentication

The application integrates AWS Amplify authentication components.

This provides experience with:

* User authentication
* Authenticated application workflows
* Cloud identity services
* Frontend authentication interfaces
* Secure interaction with backend services

---

# GraphQL

The project uses GraphQL as part of its data-access architecture.

The repository contains GraphQL configuration and related dependencies, allowing the application to communicate with backend services through structured queries and mutations.

This provides practical experience with:

* GraphQL APIs
* Schema-driven application development
* Query and mutation workflows
* Cloud-backed data access

---

# Internationalization

237Mechanic was designed with internationalization in mind.

The application includes:

* `next-intl`
* `i18next`
* `react-i18next`
* Browser language detection

This makes it possible to support multiple languages and is particularly relevant for a marketplace intended for a multilingual environment such as Cameroon.

---

# Image & Media Processing

Automotive marketplaces are highly dependent on images.

The application therefore includes functionality for handling user-uploaded media, including:

* Drag-and-drop uploads
* Browser-side image compression
* File saving
* Image processing workflows

Relevant technologies include:

* React Dropzone
* Browser Image Compression
* File Saver

Reducing image size before upload can help improve application performance and reduce unnecessary bandwidth consumption.

---

# User Interface

The project combines several UI technologies to create an interactive marketplace experience.

Technologies include:

* React
* Chakra UI
* Tailwind CSS
* Styled Components
* Framer Motion
* Heroicons
* Lucide React

The interface was designed with responsiveness and usability in mind.

---

# SEO & Discoverability

Because marketplace listings need to be discoverable through search engines, the application includes SEO-oriented functionality.

The project uses:

* Next SEO
* Sitemap generation
* Structured page configuration
* Next.js rendering capabilities

---

# Real-World Product Development

One of the main purposes of 237Mechanic is to build a usable product around a real market problem.

Rather than being limited to a coding exercise, the project involves considerations such as:

* Marketplace architecture
* User authentication
* Data management
* Media handling
* Cloud infrastructure
* Internationalization
* SEO
* Application performance
* User experience
* Future platform expansion

The project therefore combines **software engineering with product development**.

---

# Planned Platform Expansion

The marketplace is intended to serve as the foundation for a broader automotive platform.

Potential areas of expansion include:

* Motorcycles
* Commercial vehicles
* Spare parts
* Automotive services
* Tyres
* Engines
* Oils and lubricants
* Charging services
* Automotive-related businesses
* Additional mobility services

---

# Development

Clone the repository:

```bash
git clone https://github.com/etasick/237mechanicmarket.git
cd 237mechanicmarket
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The development application will normally be available at:

```text
http://localhost:3000
```

For a production build:

```bash
npm run build
```

Then:

```bash
npm start
```

---

# Configuration

The application integrates several cloud and third-party services.

Local development requires the appropriate configuration for the services used by the project, including AWS Amplify and other backend/content services.

**Production credentials and API keys should never be committed to the repository.**

---

# Project Highlights

### Full-stack development

The project combines a modern React/Next.js frontend with cloud-backed services and API integrations.

### Cloud computing

AWS Amplify and other managed services are integrated into the application architecture.

### Authentication

The application incorporates cloud-based user authentication.

### GraphQL

GraphQL is used as part of the application's backend/data-access architecture.

### Internationalization

The application was designed to support multilingual users.

### Marketplace engineering

The project addresses real-world marketplace requirements including listings, media, users, search/discovery and future expansion.

### Product development

The project demonstrates experience taking a product from concept through development and deployment.

---

# Live Application

**237Mechanic Marketplace**

https://237mechanicmarket.vercel.app/

---

# Author

**Eta Dalton Asick**

Computer Engineer | Software Engineer | Cloud & Cybersecurity

GitHub: https://github.com/etasick

---

# License

See the repository for licensing information.
