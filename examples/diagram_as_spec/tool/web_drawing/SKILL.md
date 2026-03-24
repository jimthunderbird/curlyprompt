# Laravel Authentication Flow

## Overview

A Laravel application with a simple authentication check on the index page.

## Components

- **Laravel Application** — the top-level application container
- **User** — the actor who visits the application
- **Index Controller** — handles the index route
- **Logged In?** — decision point that checks whether the user is authenticated

## Flow

1. The **User** accesses the **Laravel Application**
2. The request is routed to the **Index Controller**
3. The Index Controller checks: **Logged In?**
   - **No** → Display: *"You are not logged in"*
   - **Yes** → Display: *"You are logged in"*
