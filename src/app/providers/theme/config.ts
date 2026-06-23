import {
  Anchor,
  Autocomplete,
  Avatar,
  Button,
  Checkbox,
  createTheme,
  Menu,
  Pagination,
  PasswordInput,
  Select,
  Switch,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import clsx from 'clsx'
import classes from './theme.module.scss'

export const theme = createTheme({
  colors: {
    blue: [
      '#e4f3ff',
      '#cce2ff',
      '#99c1ff',
      '#639fff',
      '#3e87ff', // primary
      '#186fff',
      '#0066ff',
      '#0056e5',
      '#004cce',
      '#0041b6',
    ],

    lightBlue: [
      '#ebf3ff', // secondary
      '#d3e2fa',
      '#a2c3f7',
      '#6fa2f6',
      '#4886f5',
      '#3475f5',
      '#2a6cf7',
      '#205bdc',
      '#1651c5',
      '#0045ad',
    ],

    red: [
      '#ffe9e9',
      '#ffd2d2',
      '#f8a3a3',
      '#f37171',
      '#ee4746',
      '#ec2c2b',
      '#ec2121', // error
      '#d20f11',
      '#bc060d',
      '#a40008',
    ],

    gray: [
      '#FFFFFF',
      '#F8F8F9',
      '#EEEFF1', // border инпута
      '#E0E1E3',
      '#C4C6C9',
      '#A8A9AD',
      '#787B82', // серый текст в инпутах и ссылках
      '#5A5C62',
      '#3C3D43',
      '#1A1B1F',
    ],

    green: [
      '#effcea',
      '#def6d6', // зеленый для строк в картотеке
      '#bfedaf',
      '#9ce383',
      '#7eda5f',
      '#6bd547',
      '#61d23a',
      '#50ba2c',
      '#44a524',
      '#368f19',
    ],
  },

  fontFamily: 'Inter, sans-serif',
  primaryColor: 'blue',
  primaryShade: 4,
  defaultRadius: 8,

  fontSizes: {
    xs: '12px', // mini (подсказки)
    sm: '14px', // small (подписи)
    md: '16px', // body (основной текст)
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '20px',
    xl: '24px',
  },

  headings: {
    fontFamily: 'Inter, sans-serif',
    sizes: {
      h1: { fontSize: '30px', fontWeight: '700', lineHeight: '1.3' },
      h2: { fontSize: '20px', fontWeight: '700', lineHeight: '1.5' },
    },
  },

  shadows: {
    sm: '0px 0px 2px 0px rgba(0, 0, 0, 0.2)', // папка/набор
    md: '0px 0px 4px 0px rgba(0, 0, 0, 0.1)', // хедер
    lg: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)', // попап
  },

  components: {
    Anchor: Anchor.extend({
      classNames: {
        root: classes.anchorRoot,
      },
    }),

    Button: Button.extend({
      defaultProps: {
        size: 'lg',
      },

      classNames: (_theme, props) => {
        const isOutline = props.variant === 'outline'

        return {
          root: clsx(classes.buttonRoot, isOutline ? classes.buttonOutline : classes.buttonFilled),
        }
      },
    }),

    TextInput: TextInput.extend({
      defaultProps: {
        size: 'md',
      },
      classNames: {
        input: classes.input,
      },
    }),

    Select: Select.extend({
      defaultProps: {
        size: 'md',
      },
      classNames: {
        input: classes.input,
        option: classes.dropdown,
      },
    }),

    Checkbox: Checkbox.extend({
      defaultProps: {
        radius: 4,
      },
      classNames: {
        input: classes.checkboxInput,
      },
    }),

    PasswordInput: PasswordInput.extend({
      defaultProps: {
        size: 'md',
      },
      classNames: {
        input: classes.input,
        visibilityToggle: classes.passwordVisibilityToggle,
      },
    }),

    Textarea: Textarea.extend({
      defaultProps: {
        size: 'md',
      },
      classNames: {
        input: clsx(classes.input, classes.textareaInput),
      },
    }),

    Switch: Switch.extend({
      defaultProps: {
        size: 'sm',
      },
    }),

    Pagination: Pagination.extend({
      defaultProps: {
        size: 'lg',
      },
    }),

    Title: Title.extend({
      styles: (_theme, props) => ({
        root: {
          textAlign: props.order === 1 ? 'center' : undefined,
        },
      }),
    }),

    Avatar: Avatar.extend({
      defaultProps: {
        color: 'lightBlue',
      },
      styles: (theme) => ({
        placeholder: {
          backgroundColor: theme.colors.lightBlue?.[0] || '#ebf3ff',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: '24px',
          color: '#0E0E0E',
        },
      }),
    }),

    Menu: Menu.extend({
      classNames: {
        dropdown: classes.menuDropdown,
        item: classes.menuItem,
        divider: classes.menuDivider,
      },
      styles: {
        itemLabel: {
          padding: 0,
        },
      },
    }),

    Autocomplete: Autocomplete.extend({
      defaultProps: {
        size: 'md',
      },
      classNames: {
        input: clsx(classes.input, classes.autocompleteInput),
        option: classes.dropdown,
      },
    }),
  },
})
