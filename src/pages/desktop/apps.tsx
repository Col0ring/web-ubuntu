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
            title: 'index.php',
          },
          {
            parentId: '/desktop/Col0ring',
            id: '/desktop/Col0ring/Angular.js',
            title: 'Angular.js',
            filetype: Filetype.Js,
            icon: addBase('/themes/filetypes/js.png'),
          },
        ],
      },
      {
        parentId: '/desktop',
        id: '/desktop/folder2',
        title: 'folder2',
        icon: addBase('/themes/Yaru/system/folder.png'),
        render: (id) => <Folder id={id} />,
        folder: true,
        apps: [
          {
            parentId: '/desktop/folder2',
            id: '/desktop/folder2/index.js',
            filetype: Filetype.Js,
            icon: addBase('/themes/filetypes/php.png'),
            title: 'index.js',
          },
        ],
      },
      {
        parentId: '/desktop',
        id: '/desktop/Applications.link',
        title: 'Applications',
        filetype: Filetype.Link,
        icon: addBase('/themes/Yaru/system/folder.png'),
        redirect: '/application',
      },
      {
        parentId: '/desktop',
        id: '/desktop/application/Firefox Browser.link',
        title: 'Firefox Browser',
        filetype: Filetype.Link,
        icon: addBase('/themes/Yaru/apps/firefox.svg'),
        redirect: '/application/Firefox Browser.app',
      },
      {
        parentId: '/desktop',
        id: '/desktop/Todoist.link',
        title: 'Todoist',
        filetype: Filetype.Link,
        icon: addBase('/themes/Yaru/apps/todoist.png'),
        redirect: '/application/Todoist.app',
      },
      {
        parentId: '/desktop',
        id: '/desktop/Trash.link',
        title: 'Trash',
        filetype: Filetype.Link,
        icon: addBase('/themes/Yaru/system/user-trash-full.png'),
        redirect: '/Trash',
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
        id: '/application/Firefox Browser.app',
        title: 'Firefox Browser',
        icon: addBase('/themes/Yaru/apps/firefox.svg'),
        filetype: Filetype.App,
        disabled: false,
        render: () => <Firefox />,
      },
      {
        parentId: '/application',
        id: '/application/Todoist.app',
        title: 'Todoist',
        filetype: Filetype.App,
        icon: addBase('/themes/Yaru/apps/todoist.png'),
        disabled: false,
        render: () => <Todoist />,
      },
      {
        parentId: '/application',
        id: '/application/About Col0ring.app',
        title: 'About Col0ring',
        filetype: Filetype.App,
        icon: addBase('/themes/Yaru/system/user-home.png'),
        disabled: false,
      },
      {
        parentId: '/application',
        id: '/application/Visual Studio Code.app',
        title: 'Visual Studio Code',
        filetype: Filetype.App,
        icon: addBase('/themes/Yaru/apps/vscode.png'),
        disabled: false,
        render: () => <VsCode />,
      },
      {
        parentId: '/application',
        id: '/application/Terminal.app',
        title: 'Terminal',
        filetype: Filetype.App,
        icon: addBase('/themes/Yaru/apps/bash.png'),
        disabled: false,
      },
      {
        parentId: '/application',
        id: '/application/Music.app',
        title: 'Music',
        filetype: Filetype.App,
        icon: addBase('/themes/Yaru/apps/vue-aplayer-round.png'),
        disabled: false,
      },
      {
        parentId: '/application',
        id: '/application/Settings.app',
        title: 'Settings',
        filetype: Filetype.App,
        icon: addBase('/themes/Yaru/apps/gnome-control-center.png'),
        disabled: false,
        render: () => <Settings />,
      },
      {
        parentId: '/application',
        id: '/application/Send a Message.app',
        filetype: Filetype.App,
        title: 'Send a Message',
        icon: addBase('/themes/Yaru/apps/gedit.png'),
        disabled: false,
      },
    ],
  },
  {
    parentId: '/',
    id: '/Trash',
    title: 'Trash',
    icon: addBase('/themes/Yaru/system/user-trash-full.png'),
    disabled: false,
    folder: true,
    render: () => <Trash />,
    apps: [
      {
        parentId: '/Trash',
        id: '/Trash/index.php',
        filetype: Filetype.Php,
        icon: addBase('/themes/filetypes/php.png'),
        title: 'index.php',
      },
      {
        parentId: '/Trash',
        id: '/Trash/Angular.js',
        title: 'Angular.js',
        filetype: Filetype.Js,
        icon: addBase('/themes/filetypes/js.png'),
      },
    ],
  },
]
export default apps
