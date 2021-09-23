import React from 'react'
import { UbuntuApp } from '@/typings/app'
import { addBase } from '@/utils/prod'
import { Filetype } from './constants'
import Folder from './apps/folder'

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
        icon: addBase('/themes/Yaru/system/folder.png'),
        render: (id) => <Folder id={id} />,
        folder: true,
        apps: [
          {
            parentId: '/desktop/Col0ring',
            id: '/desktop/Col0ring/index.php',
            filetype: Filetype.Php,
            icon: addBase('/themes/filetypes/php.png'),
            title: 'php',
          },
          {
            parentId: '/desktop/Col0ring',
            title: 'Angular.js',
            filetype: Filetype.Js,
            id: '/desktop/Col0ring/Angular.js',
            icon: addBase('/themes/filetypes/js.png'),
          },
        ],
      },
      {
        parentId: '/desktop',
        id: '/desktop/222',
        title: '222',
        icon: addBase('/themes/Yaru/system/folder.png'),
        render: (id) => <Folder id={id} />,
        folder: true,
        apps: [
          {
            parentId: '/desktop/222',
            id: '/desktop/222/js',
            icon: addBase('/themes/filetypes/php.png'),
            title: 'js',
          },
        ],
      },
      {
        parentId: '/desktop',
        id: '/desktop/application-shortcut',
        title: 'Applications',
        icon: addBase('/themes/Yaru/system/folder.png'),
        redirect: '/application',
      },
      {
        parentId: '/desktop',
        id: '/desktop/application/Firefox Browser-shortcut',
        title: 'Firefox Browser',
        filetype: 'link',
        icon: addBase('/themes/Yaru/apps/firefox.svg'),
        redirect: '/application/Firefox Browser',
      },
      {
        parentId: '/desktop',
        id: '/desktop/todo-ist-shortcut',
        title: 'Todoist',
        icon: addBase('/themes/Yaru/apps/todoist.png'),
        redirect: '/application/todo-ist',
      },
    ],
  },
  {
    parentId: '/',
    folder: true,
    id: '/application',
    title: 'Application',
    icon: addBase('/themes/Yaru/system/folder.png'),
    render: (id) => <Folder id={id} />,
    apps: [
      {
        parentId: '/application',
        id: '/application/Firefox Browser',
        title: 'Firefox Browser',
        icon: addBase('/themes/Yaru/apps/firefox.svg'),
        disabled: false,
        render: () => <Firefox />,
      },
      {
        parentId: '/application',
        id: '/application/todo-ist',
        title: 'Todoist',
        icon: addBase('/themes/Yaru/apps/todoist.png'),
        disabled: false,
        render: () => <Todoist />,
      },
      {
        parentId: '/application',
        id: '/application/about-col0ring',
        title: 'About Col0ring',
        icon: addBase('/themes/Yaru/system/user-home.png'),
        disabled: false,
      },
      {
        parentId: '/application',
        id: '/application/vscode',
        title: 'Visual Studio Code',
        icon: addBase('/themes/Yaru/apps/vscode.png'),
        disabled: false,
        render: () => <VsCode />,
      },
      {
        parentId: '/application',
        id: '/application/terminal',
        title: 'Terminal',
        icon: addBase('/themes/Yaru/apps/bash.png'),
        disabled: false,
      },
      {
        parentId: '/application',
        id: '/application/music',
        title: 'Music',
        icon: addBase('/themes/Yaru/apps/vue-aplayer-round.png'),
        disabled: false,
      },
      {
        parentId: '/application',
        id: '/application/settings',
        title: 'Settings',
        icon: addBase('/themes/Yaru/apps/gnome-control-center.png'),
        disabled: false,
        render: () => <Settings />,
      },
      {
        parentId: '/application',
        id: '/application/trash',
        title: 'Trash',
        icon: addBase('/themes/Yaru/system/user-trash-full.png'),
        disabled: false,
        folder: true,
        render: () => <Trash />,
        apps: [
          {
            parentId: '/application/trash',
            id: '/application/trash/index.php',
            icon: addBase('/themes/filetypes/php.png'),
            title: 'php',
          },
          {
            parentId: '/application/trash',
            title: 'Angular.js',
            id: '/application/trash/Angular.js',
            icon: addBase('/themes/filetypes/js.png'),
          },
        ],
      },
      {
        parentId: '/application',
        id: '/application/gedit',
        title: 'Send a Message',
        icon: addBase('/themes/Yaru/apps/gedit.png'),
        disabled: false,
      },
    ],
  },
]
export default apps
