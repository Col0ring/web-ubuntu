import React from 'react'
import { UbuntuApp } from './typings/app'

const VsCode = React.lazy(() => import('@/pages/desktop/apps/vscode'))
const Todoist = React.lazy(() => import('@/pages/desktop/apps/todoist'))
const Firefox = React.lazy(() => import('@/pages/desktop/apps/firefox'))
const Settings = React.lazy(() => import('@/pages/desktop/apps/settings'))
const Trash = React.lazy(() => import('@/pages/desktop/apps/trash'))

const apps: UbuntuApp[] = [
  {
    parentId: '/',
    folder: true,
    id: '/desktop',
    title: 'Desktop',
    apps: [
      {
        parentId: '/desktop',
        id: '/desktop/firefox-shortcut',
        title: 'Firefox Browser',
        icon: './themes/Yaru/apps/firefox.svg',
        redirect: '/application/firefox',
      },
      {
        parentId: '/desktop',
        id: '/application/todo-ist',
        title: 'Todoist',
        icon: './themes/Yaru/apps/todoist.png',
        redirect: '/application/todoist',
      },
    ],
  },
  {
    parentId: '/',
    folder: true,
    id: '/application',
    title: 'Application',
    apps: [
      {
        parentId: '/application',
        id: '/application/firefox',
        title: 'Firefox Browser',
        icon: './themes/Yaru/apps/firefox.svg',
        disabled: false,
        favorite: true,
        render: () => <Firefox />,
      },
      {
        parentId: '/application',
        id: '/application/todo-ist',
        title: 'Todoist',
        icon: './themes/Yaru/apps/todoist.png',
        disabled: false,
        favorite: true,
        render: () => <Todoist />,
      },
      {
        parentId: '/application',
        id: '/application/about-col0ring',
        title: 'About Col0ring',
        icon: './themes/Yaru/system/user-home.png',
        disabled: false,
        favorite: true,
      },
      {
        parentId: '/application',
        id: '/application/vscode',
        title: 'Visual Studio Code',
        icon: './themes/Yaru/apps/vscode.png',
        disabled: false,
        favorite: true,
        render: () => <VsCode />,
      },
      {
        parentId: '/application',
        id: '/application/terminal',
        title: 'Terminal',
        icon: './themes/Yaru/apps/bash.png',
        disabled: false,
        favorite: true,
      },
      {
        parentId: '/application',
        id: '/application/music',
        title: 'Music',
        icon: './themes/Yaru/apps/vue-aplayer-round.png',
        disabled: false,
        favorite: false,
      },
      {
        parentId: '/application',
        id: '/application/settings',
        title: 'Settings',
        icon: './themes/Yaru/apps/gnome-control-center.png',
        disabled: false,
        favorite: true,
        render: () => <Settings />,
      },
      {
        parentId: '/application',
        id: '/application/trash',
        title: 'Trash',
        icon: './themes/Yaru/system/user-trash-full.png',
        disabled: false,
        favorite: true,
        folder: true,
        render: () => <Trash />,
        apps: [
          {
            parentId: '/application/trash',
            id: '/application/trash/index.php',
            icon: './themes/filetypes/php.png',
            title: 'php',
          },
          {
            parentId: '/application/trash',
            title: 'Angular.js',
            id: 'Angular.js',
            icon: './themes/filetypes/js.png',
          },
        ],
      },
      {
        parentId: '/application',
        id: '/application/gedit',
        title: 'Send a Message',
        icon: './themes/Yaru/apps/gedit.png',
        disabled: false,
        favorite: false,
      },
    ],
  },
]
export default apps
