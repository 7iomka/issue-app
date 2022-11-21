Yarn workspaces

"workspaces": [
"apps/store",
"packages/*"
]

Folder structure

- Root
  -- apps
  --- next-app
  -- packages
  --- config
  --- hooks
  --- icons
  --- types
  --- utils
  --- types

--store
"@steklo24/config": "link:../../packages/config",
"@steklo24/hooks": "link:../../packages/hooks",
"@steklo24/icons": "link:../../packages/icons",
"@steklo24/types": "link:../../packages/types",
"@steklo24/utils": "link:../../packages/utils",

-- ui
"@steklo24/config": "link:../config",
"@steklo24/hooks": "link:../hooks",
"@steklo24/icons": "link:../icons",
"@steklo24/types": "link:../types",
"@steklo24/utils": "link:../utils",

-- utils
"@steklo24/types": "link:../types",

--hooks
"@steklo24/types": "link:../types",
"@steklo24/utils": "link:../utils",

--modules
"@steklo24/config": "link:../config",
