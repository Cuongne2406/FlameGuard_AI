# 📘 AI AGENT IMPLEMENTATION SPEC

# Sidebar Refactor – Admin Dashboard

---

# 1. PROJECT CONTEXT

## Project

FlameGuard AI – DYUS Master Enterprise

## Module Scope

```txt
/admin/*
```

## Tech Stack

| Technology | Value               |
| ---------- | ------------------- |
| Framework  | React + Vite        |
| Router     | React Router DOM v6 |
| Styling    | Tailwind CSS        |
| Icons      | Lucide React        |
| State      | React Hooks         |

---

# 2. PRIMARY OBJECTIVE

Refactor Admin Sidebar from:

```txt
Flat navigation + internal tab state
```

into:

```txt
Collapsible parent-child sidebar navigation
```

The new system must:

* support nested sidebar items
* support submenu expand/collapse
* support independent child routes
* auto-highlight active routes
* auto-expand active parent menus
* preserve current responsive mobile drawer behavior
* avoid breaking existing layout/authentication

---

# 3. IMPORTANT RESTRICTIONS

## DO NOT MODIFY

The following MUST remain untouched:

```txt
src/components/admin/Org/OrgChart.jsx
src/components/admin/Org/UnitList.jsx
src/components/admin/Org/MemberProfile.jsx
```

Also DO NOT modify:

* AdminLayout.jsx
* authentication logic
* protected routes
* backend APIs
* user pages
* public pages

Only refactor routing + sidebar + wrapper pages.

---

# 4. EXISTING PROBLEM

Current route:

```txt
/admin/organization
```

Current page uses internal tab switching:

```jsx
const [activeTab, setActiveTab] = useState()
```

This causes:

| Problem                                 | Impact                   |
| --------------------------------------- | ------------------------ |
| No child URLs                           | Cannot deep link         |
| No bookmarkable sections                | Bad UX                   |
| Sidebar cannot detect active subsection | Navigation inconsistency |
| Uses internal state instead of routing  | Hard to scale            |

---

# 5. TARGET SIDEBAR STRUCTURE

```txt
Sidebar Admin
│
├── Dashboard
│   └── /admin/dashboard
│
├── Tổ chức & Nhân sự
│   ├── /admin/organizations
│   ├── /admin/organizations/org-chart
│   ├── /admin/organizations/units
│   └── /admin/organizations/members
│
├── Campaigns
├── Finance
├── Awards
├── Documents
├── AI
└── Settings
```

---

# 6. REQUIRED ROUTE CHANGES

## FILE

```txt
src/routes/AppRoutes.jsx
```

---

## REMOVE OLD ROUTE

REMOVE:

```jsx
<Route path="organization" element={<Organization />} />
```

---

## ADD NEW ROUTES

ADD:

```jsx
<Route path="organizations" element={<OrganizationsPage />} />
<Route path="organizations/org-chart" element={<OrgChartPage />} />
<Route path="organizations/units" element={<UnitsPage />} />
<Route path="organizations/members" element={<MembersPage />} />
```

---

## REQUIRED REDIRECT

MUST redirect:

```txt
/admin/organization
→
/admin/organizations
```

Example:

```jsx
<Route
  path="organization"
  element={<Navigate to="/admin/organizations" replace />}
/>
```

---

# 7. REQUIRED FOLDER RESTRUCTURE

## OLD

```txt
src/pages/admin/Organization/
```

---

## NEW

CREATE:

```txt
src/pages/admin/Organizations/
│
├── OrganizationsPage.jsx
├── OrgChartPage.jsx
├── UnitsPage.jsx
└── MembersPage.jsx
```

---

# 8. PAGE RESPONSIBILITIES

## 8.1 OrganizationsPage.jsx

### Purpose

Parent overview page.

### Responsibilities

Keep ONLY:

* statistics cards
* summary widgets
* organization overview
* optional breadcrumb

### MUST REMOVE

REMOVE ALL:

* tab switching
* activeTab state
* tab buttons
* conditional rendering logic

---

## 8.2 OrgChartPage.jsx

### Purpose

Dedicated route page.

### MUST RENDER

```jsx
<OrgChart />
```

### Example

```jsx
import OrgChart from '@/components/admin/Org/OrgChart'

export default function OrgChartPage() {
  return (
    <div className="space-y-6">
      <OrgChart />
    </div>
  )
}
```

---

## 8.3 UnitsPage.jsx

### MUST RENDER

```jsx
<UnitList />
```

---

## 8.4 MembersPage.jsx

### MUST RENDER

```jsx
<MemberProfile />
```

---

# 9. SIDEBAR REFACTOR

## FILE

```txt
src/components/admin/Sidebar.jsx
```

---

# 10. REQUIRED MENU DATA STRUCTURE

REPLACE flat menu array with:

```jsx
const menuItems = [
  {
    icon: <LayoutDashboard size={20} />,
    label: 'Dashboard',
    path: '/admin/dashboard',
    children: null,
  },
  {
    icon: <Users size={20} />,
    label: 'Tổ chức & Nhân sự',
    path: '/admin/organizations',
    children: [
      {
        label: 'Sơ đồ Cây',
        path: '/admin/organizations/org-chart',
        icon: <GitBranch size={16} />,
      },
      {
        label: 'Danh sách Đơn vị',
        path: '/admin/organizations/units',
        icon: <Building2 size={16} />,
      },
      {
        label: 'Hồ sơ Cán bộ',
        path: '/admin/organizations/members',
        icon: <UserRound size={16} />,
      },
    ],
  },
]
```

---

# 11. REQUIRED STATE MANAGEMENT

ADD:

```jsx
const [openMenus, setOpenMenus] = useState({})
```

Example state:

```js
{
  'Tổ chức & Nhân sự': true,
}
```

---

# 12. REQUIRED LOCATION LOGIC

IMPORT:

```jsx
import { useLocation } from 'react-router-dom'
```

ADD:

```jsx
const location = useLocation()
```

---

# 13. AUTO EXPAND REQUIREMENT

Sidebar MUST auto-open parent menu when current URL belongs to a child route.

Example:

```txt
/admin/organizations/units
```

MUST automatically:

* expand “Tổ chức & Nhân sự”
* highlight “Danh sách Đơn vị”

---

## REQUIRED IMPLEMENTATION

```jsx
useEffect(() => {
  menuItems.forEach(item => {
    if (item.children) {
      const isChildActive = item.children.some(child =>
        location.pathname.startsWith(child.path)
      )

      if (isChildActive) {
        setOpenMenus(prev => ({
          ...prev,
          [item.label]: true,
        }))
      }
    }
  })
}, [location.pathname])
```

---

# 14. PARENT MENU BEHAVIOR

## Clicking Parent Label

MUST:

1. navigate to parent route
2. toggle submenu open

---

## Clicking Toggle Arrow

MUST:

1. ONLY toggle submenu
2. MUST NOT navigate

---

# 15. CRITICAL IMPLEMENTATION DETAIL

## DO NOT PLACE TOGGLE BUTTON INSIDE NavLink

WRONG:

```jsx
<NavLink>
  <button />
</NavLink>
```

This causes:

* accidental navigation
* double event bubbling
* broken UX

---

## CORRECT STRUCTURE

```jsx
<div>
  <NavLink />
  <button />
</div>
```

---

# 16. REQUIRED ACTIVE STATE LOGIC

## Parent menu active when:

```txt
- current route === parent route
OR
- current route matches any child route
```

---

## REQUIRED CHECK

```jsx
item.children?.some(child =>
  location.pathname.startsWith(child.path)
)
```

---

# 17. REQUIRED SUBMENU RENDERING

IMPLEMENT submenu rendering:

```jsx
{item.children && openMenus[item.label] && (
  <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-100 pl-4">
    {item.children.map((child) => (
      <NavLink
        key={child.path}
        to={child.path}
      >
        {child.label}
      </NavLink>
    ))}
  </div>
)}
```

---

# 18. REQUIRED UI RULES

## Parent Menu

Must:

* use larger font
* use larger icon
* support active highlight
* support hover state

---

## Child Menu

Must:

* be indented
* use smaller font
* include border-left hierarchy line
* support active highlight

---

# 19. REQUIRED ACTIVE COLORS

## Parent Active

```txt
bg-blue-50
text-blue-600
font-bold
```

---

## Child Active

```txt
bg-blue-50
text-blue-600
font-semibold
```

---

# 20. REQUIRED ANIMATION

Submenu MUST animate.

Recommended:

```txt
transition-all
max-height
overflow-hidden
```

---

# 21. REQUIRED TOGGLE ANIMATION

Chevron arrow MUST rotate.

Closed:

```css
rotate-0
```

Opened:

```css
rotate-90
```

Example:

```jsx
className={`transition-transform duration-200 ${
  openMenus[item.label] ? 'rotate-90' : ''
}`}
```

---

# 22. MOBILE REQUIREMENTS

Existing mobile drawer behavior MUST remain unchanged.

---

## REQUIRED

When clicking child menu:

```jsx
setIsOpen(false)
```

must still execute.

---

# 23. OPTIONAL REFACTOR SECTIONS

Optional:

* Campaigns
* Finance
* Awards

---

## IF THESE PAGES USE INTERNAL TABS

Then:

* create sub-routes
* create child pages
* convert to sidebar submenu

Otherwise:

keep as leaf items.

---

# 24. REQUIRED IMPORTS

## React Router

```jsx
import {
  NavLink,
  useLocation,
  Navigate,
} from 'react-router-dom'
```

---

## React

```jsx
import {
  useState,
  useEffect,
} from 'react'
```

---

## Lucide Icons

```jsx
import {
  GitBranch,
  Building2,
  UserRound,
  ChevronRight,
} from 'lucide-react'
```

---

# 25. EXPECTED FINAL ARCHITECTURE

```txt
Sidebar
│
├── Dashboard
│
├── Organizations
│   ├── Org Chart
│   ├── Units
│   └── Members
│
├── Campaigns
├── Finance
├── Awards
├── Documents
├── AI
└── Settings
```

---

# 26. ACCEPTANCE CHECKLIST

## Sidebar

* [ ] Parent-child sidebar renders correctly
* [ ] Parent menu expands/collapses
* [ ] Chevron rotates correctly
* [ ] Active states work correctly
* [ ] Auto-expand works correctly

---

## Routing

* [ ] /admin/organizations works
* [ ] /admin/organizations/org-chart works
* [ ] /admin/organizations/units works
* [ ] /admin/organizations/members works
* [ ] old route redirects correctly

---

## UI

* [ ] submenu indentation correct
* [ ] active colors correct
* [ ] hover states correct
* [ ] animations smooth

---

## Mobile

* [ ] drawer still works
* [ ] submenu works on mobile
* [ ] sidebar closes after child click

---

## Stability

* [ ] no console errors
* [ ] no infinite re-renders
* [ ] no broken routes
* [ ] no duplicated navigation

---

# 27. IMPLEMENTATION ORDER (IMPORTANT)

AI agent SHOULD implement in this order:

## STEP 1

Create new page folder:

```txt
src/pages/admin/Organizations/
```

---

## STEP 2

Create:

* OrganizationsPage.jsx
* OrgChartPage.jsx
* UnitsPage.jsx
* MembersPage.jsx

---

## STEP 3

Refactor AppRoutes.jsx

---

## STEP 4

Add redirect route.

---

## STEP 5

Refactor Sidebar.jsx.

---

## STEP 6

Add submenu rendering.

---

## STEP 7

Add active logic.

---

## STEP 8

Add auto-expand logic.

---

## STEP 9

Add animation.

---

## STEP 10

Test all routes manually.

---

# 28. SUCCESS CRITERIA

Implementation is considered successful ONLY IF:

* direct URL access works
* sidebar correctly reflects current location
* submenu auto-expands
* mobile drawer behavior remains intact
* no existing admin pages break
* no organization components are modified

---

# 29. FINAL NOTES FOR AI AGENT

This is a UI architecture refactor.

Primary focus:

* routing consistency
* scalable navigation structure
* maintainable sidebar system
* reusable child route architecture

DO NOT redesign the UI.

DO NOT modify business logic.

DO NOT rewrite organization components.

ONLY:

* restructure routes
* restructure sidebar
* create wrapper pages
* improve navigation architecture
