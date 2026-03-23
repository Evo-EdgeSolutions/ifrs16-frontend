src/
├── app/                      
│   ├── layout.tsx
│   ├── page.tsx              # Updates needed here (imports)
│   └── page.module.scss
├── components/               
│   └── ui/                   # Global, reusable UI stays here!
│       ├── Button.tsx
│       ├── Button.module.scss
│       ├── InputField.tsx
│       └── InputField.module.scss
├── features/                 # NEW: Feature-Sliced domains
│   └── calculator/           
│       ├── components/       # Calculator-specific UI
│       │   ├── CalcForm.tsx
│       │   ├── CalcResult.tsx
│       │   └── Calculator.module.scss
│       ├── schema.ts         # Zod schemas & types for calculator
│       ├── store.ts          # Zustand store for calculator
│       └── logic.ts          # Heavy math/business logic
│       └── utils.ts          # Heavy math/business logic
├── styles/                   
│   ├── _variables.scss
│   └── globals.scss