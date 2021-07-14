import React from 'react'
import { UbuntuApp } from './typings/app'

const VsCode = React.lazy(() => import('@/pages/desktop/apps/vscode'))
const Todoist = React.lazy(() => import('@/pages/desktop/apps/todoist'))
const Firefox = React.lazy(() => import('@/pages/desktop/apps/firefox'))
const Settings = React.lazy(() => import('@/pages/desktop/apps/settings'))
const Trash = React.lazy(() => import('@/pages/desktop/apps/trash'))
const apps: UbuntuApp[] = [
  {
    id: 'firefox',
    title: 'Firefox Browser',
    icon: './themes/Yaru/apps/firefox.svg',
    disabled: false,
    favorite: true,
    shortcut: true,
    component: Firefox,
  },
  {
    id: 'todo-list',
    title: 'Todoist',
    icon: './themes/Yaru/apps/todoist.png',
    disabled: false,
    favorite: true,
    shortcut: false,
    component: Todoist,
  },
  {
    id: 'about-col0ring',
    title: 'About Col0ring',
    icon: './themes/Yaru/system/user-home.png',
    disabled: false,
    favorite: true,
    shortcut: true,
  },
  {
    id: 'vscode',
    title: 'Visual Studio Code',
    icon: './themes/Yaru/apps/vscode.png',
    disabled: false,
    favorite: true,
    shortcut: false,
    component: VsCode,
  },
  {
    id: 'terminal',
    title: 'Terminal',
    icon: './themes/Yaru/apps/bash.png',
    disabled: false,
    favorite: true,
    shortcut: false,
  },
  {
    id: 'music',
    title: 'Music',
    icon: './themes/Yaru/apps/vue-aplayer-round.png',
    disabled: false,
    favorite: false,
    shortcut: false,
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: './themes/Yaru/apps/gnome-control-center.png',
    disabled: false,
    favorite: true,
    shortcut: false,
    component: Settings,
  },
  {
    id: 'trash',
    title: 'Trash',
    icon: './themes/Yaru/system/user-trash-full.png',
    disabled: false,
    favorite: true,
    shortcut: false,
    component: Trash,
    apps: [
      {
        id: 'php',
        title: 'php',
        icon: './themes/filetypes/php.png',
        position: {
          left: 0,
          top: 0,
        },
      },
      {
        title: 'Angular.js',
        id: 'Angular.js',
        icon: './themes/filetypes/js.png',
        position: {
          left: 0,
          top: 0,
        },
      },
    ],
  },
  {
    id: 'gedit',
    title: 'Send a Message',
    icon: './themes/Yaru/apps/gedit.png',
    disabled: false,
    favorite: false,
    shortcut: true,
  },
]
export default apps
