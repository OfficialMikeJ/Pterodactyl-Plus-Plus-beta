### Design & Branding Integration
*   **Custom Branding:** Name is "Touch Down Hosting". Theme colors are Black, White, and Orange. I will provide the logo/branding in `.png` format.
*   **Auto-Sizing Logo:** Allow custom branding uploads and auto-adjust the size of the branding/logo to fit correctly into the panel.
*   **Global Reskin:** Reskin the entire panel using Black and Orange, with White accents for text, certain buttons, and icons.
*   **Glass Morphism:** Apply a fully custom Glass Morph overlay to the entire panel.
*   **Icons:** Use Font Awesome icons exclusively (do not use emojis).
*   **Dynamic Buttons:** Redesign all buttons to be White and Orange, styling them based on the context of the options and the specific area of the panel being navigated. Include a dedicated "About Touch Down Hosting" tab/button styled in White/Orange.

### Login Experience
*   **Pulsating Login Sequence:** Completely redesign the login screen. When users log in, display my `.png` logo pulsating with a slight delay before transitioning fully into the dashboard.
*   **Remember Me:** Add a "Save my login for 30 days" checkbox, styled specifically in the custom Orange theme.

### Theming System
*   **Custom JSON Themes:** Allow custom themes to be added via `.json` files at any time right after installation.
*   **Default Themes Included:** Set up the following four themes out of the box:
    1.  Cool Orange (Default)
    2.  Cool Blue Ocean
    3.  Cool Green Mint
    4.  Cool Silk Purple

### Custom Trophy & EXP System
*   **Mechanics:** Create a custom EXP system where users earn trophies for performing certain actions. Start with a total of 50 trophies (I will add more later).
*   **Notifications:** When a trophy is earned, a toast notification must pop up displaying the earned trophy.
*   **Important Question for Claude:** Before writing the code for this, please ask me what style and theme I want to use for the trophy names.

### Service & Billing Tab
*   **Payment Gateways:** Create a fully custom Service tab allowing the panel to be hosted and linked to major payment systems via API keys (start with Stripe and PayPal).
*   **Disclaimer:** Above the "Enable" switch (which must be OFF by default), include this exact disclaimer:
    > "Touch Down Hosting devs are not responsible for any loss of revenue, Stolen or leaked API Keys or credentials - Please keep your API keys and Credentials safe and secure at all times"
*   **Draggable Pricing Cards:** Include custom pre-set pricing cards. When the "Services" switch is toggled ON (displays as Orange), these cards can be dragged to reorder them.
    *   *Constraint:* Cards can only be dragged left-to-right and right-to-left (not up and down).
    *   *Saving:* Whichever order the user places them in is how they will display once the "Orange Save button" is pressed.

### Dev-Blogs Tab
*   **Hardcoded Updates Page:** Add a custom "Dev-Blogs" tab for updating the panel with new features, hotfixes, news, etc. This page must be hardcoded and cannot be edited or modified by users (it is strictly meant for me to edit the contents externally).