# **App Name**: YAMLForge

## Core Features:

- YAML Data Input: Provide a form for users to input data for various OpenChoreo YAML configurations, covering component types (Service, WebApplication, ScheduledTask), build strategies (Google Cloud Buildpacks, Dockerfile-based Builds, React Buildpacks, Ballerina Buildpacks), and deployment patterns.
- YAML Generation: Dynamically generate YAML code based on user inputs, adhering to OpenChoreo's structure and specifications. Use a client side yaml parser and convert to properly formatted string.
- YAML Preview: Offer a user-friendly interface to preview the generated YAML code before downloading.
- YAML Download: Enable users to download the generated YAML file for use in OpenChoreo deployments.
- AI-Powered YAML Assistance: AI-powered assistance tool that offers suggestions and auto-completes YAML configurations based on context and user inputs. An LLM will use reasoning to help decide whether or not a parameter makes sense to suggest in the given context.
- YAML Template Selection: Provide a selection of common YAML templates (e.g., Service, WebApplication) to streamline the configuration process.

## Style Guidelines:

- Primary color: Deep Indigo (#4B0082) to convey stability and technical expertise.
- Background color: Light Lavender (#E6E6FA), providing a gentle, non-distracting backdrop that keeps the focus on the code.
- Accent color: Soft Gold (#DAA520) to highlight key interactive elements like the download button.
- Body font: 'Inter', a sans-serif font known for its legibility in UI design, and its modern, objective appearance. Headline font: 'Space Grotesk', a sans-serif font for its techy feel and suitability for headlines. 
- Code font: 'Source Code Pro' for displaying YAML code snippets clearly.
- Use minimalistic icons representing component types and actions, ensuring clarity and ease of use.
- Implement a clean and intuitive layout with clear visual hierarchy, ensuring users can easily navigate the form and preview the YAML.