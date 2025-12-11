/user/register -> user register form

/user/login -> user login form

/food-partner/register -> food-partner register form

/food-partner/login -> food-partner login form

## 1. Which form-state method is better? One object OR separate states?

- One state object

  const [form, setForm] = useState({
  fullName: "",
  email: "",
  password: "",
  });

Pros: cleaner, scalable, easier to pass to API, easier to add more fields

Cons: Updating any field will cause the whole component to re-render

- Separate states

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

Pros: Each field change only re-renders once. More controlled.

Cons: Too many variables -> messy. Hard to scale for large forms

**Which one is better?**

Industry prefers single state object for forms because:

- React re-renders the component anyway (small cost)
- Code becomes MUCH cleaner
- Easy API calls (axios.post(form))

Re-rendering is NOT an issue unless you have 100+ fields.

## When re-rendering becomes a performance issue

When React re-renders too much, UI becomes: slow, laggy, inputs freeze, animations drop frames

React example: A huge form.

    Imagine an insurance application form with: 150 text inputs, 30 dropdowns, 20 toggles, multiple nested components

    This is the real-world UI from an insurance dashboard:

        Personal details (20 fields)

            Employment details (30 fields)
            Health history (50 fields)
            Family history (20 fields)
            Nominee details (10 fields)
            Attachments (5 uploads)

    If every keypress in ONE input re-renders ALL 135 components, the form lags. 

    Why? 

        Because React re-renders the component when any state within it changes. 


## Application theme in accordance with the system 

CSS: @media (prefers-color-scheme: dark)


## Why VALIDATION in both frontend and Backend? 

- Frontend Validation: for user experience, Prevent unnecessary API calls, Instant feedback 

  Example: User types "sonu@gmail" -> shows error instantly 

- Backend Validation: For security, frontend can be bypassed, protects database 


**Industry Standard:**

- Validate BOTH in frontend + backend 

  Frontend = UX 
  Backend = Security 