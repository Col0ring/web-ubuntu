import React from 'react'
import Folder from './apps/folder'
import { UbuntuApp } from '@/typings/app'

const Todoist = React.lazy(() => import('./apps/todoist'))
const Firefox = React.lazy(() => import('./apps/firefox'))
const Settings = React.lazy(() => import('./apps/settings'))
const Trash = React.lazy(() => import('./apps/trash'))
const VsCode = React.lazy(() => import('./apps/vscode'))

const apps: UbuntuApp[] = [
  {
    parentId: '/',
    folder: true,
    id: '/desktop',
    title: 'Desktop',
    apps: [
      {
        parentId: '/desktop',
        id: '/desktop/Col0ring',
        title: 'Col0ring',
        icon: './themes/Yaru/system/folder.png',
        render: (id) => <Folder id={id} />,
        folder: true,
        position: {
          left: 0,
          top: 1,
        },
        apps: [
          {
            parentId: '/desktop/Col0ring',
            id: '/desktop/Col0ring/index.php',
            icon: './themes/filetypes/php.png',
            title: 'php',
          },
          {
            parentId: '/desktop/Col0ring',
            title: 'Angular.js',
            id: '/desktop/Col0ring/Angular.js',
            icon: './themes/filetypes/js.png',
          },
        ],
      },
      {
        parentId: '/desktop',
        id: '/desktop/222',
        title: '222',
        icon: './themes/Yaru/system/folder.png',
        render: (id) => <Folder id={id} />,
        folder: true,
        position: {
          left: 0,
          top: 76,
        },
        apps: [
          {
            parentId: '/desktop/222',
            id: '/desktop/222/js',
            icon: './themes/filetypes/php.png',
            title: 'js',
          },
        ],
      },
      {
        parentId: '/desktop',
        id: '/desktop/application-shortcut',
        title: 'Applications',
        position: {
          left: 0,
          top: 151,
        },
        icon: './themes/Yaru/system/folder.png',
        redirect: '/application',
      },
      {
        parentId: '/desktop',
        id: '/desktop/firefox-shortcut',
        title: 'Firefox Browser',
        position: {
          left: 0,
          top: 226,
        },
        icon: './themes/Yaru/apps/firefox.svg',
        redirect: '/application/firefox',
      },
      {
        parentId: '/desktop',
        id: '/application/todo-ist-shortcut',
        title: 'Todoist',
        position: {
          left: 0,
          top: 318,
        },
        icon: './themes/Yaru/apps/todoist.png',
        redirect: '/application/todo-ist',
      },
    ],
  },
  {
    parentId: '/',
    folder: true,
    id: '/application',
    title: 'Application',
    render: (id) => <Folder id={id} />,
    apps: [
      {
        parentId: '/application',
        id: '/application/firefox',
        title: 'Firefox Browser',
        icon: './themes/Yaru/apps/firefox.svg',
        disabled: false,
        render: () => <Firefox />,
      },
      {
        parentId: '/application',
        id: '/application/todo-ist',
        title: 'Todoist',
        icon: './themes/Yaru/apps/todoist.png',
        disabled: false,
        render: () => <Todoist />,
      },
      {
        parentId: '/application',
        id: '/application/about-col0ring',
        title: 'About Col0ring',
        icon: './themes/Yaru/system/user-home.png',
        disabled: false,
      },
      {
        parentId: '/application',
        id: '/application/vscode',
        title: 'Visual Studio Code',
        icon: './themes/Yaru/apps/vscode.png',
        disabled: false,
        render: () => <VsCode />,
      },
      {
        parentId: '/application',
        id: '/application/terminal',
        title: 'Terminal',
        icon: './themes/Yaru/apps/bash.png',
        disabled: false,
      },
      {
        parentId: '/application',
        id: '/application/music',
        title: 'Music',
        icon: './themes/Yaru/apps/vue-aplayer-round.png',
        disabled: false,
      },
      {
        parentId: '/application',
        id: '/application/settings',
        title: 'Settings',
        icon: './themes/Yaru/apps/gnome-control-center.png',
        disabled: false,
        render: () => <Settings />,
      },
      {
        parentId: '/application',
        id: '/application/trash',
        title: 'Trash',
        icon: './themes/Yaru/system/user-trash-full.png',
        disabled: false,
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
            id: '/application/trash/Angular.js',
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
      },
    ],
  },
]
export default apps
