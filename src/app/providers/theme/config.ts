import {
  Anchor,
  Button,
  Checkbox,
  createTheme,
  Pagination,
  PasswordInput,
  Select,
  Switch,
  Textarea,
  TextInput,
} from '@mantine/core'

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
      defaultProps: {
        c: 'gray.6',
        fw: 400,
      },
    }),

    Button: Button.extend({
      defaultProps: {
        size: 'lg',
        fw: 600,
      },
      styles: {
        root: {
          maxHeight: 48,

          '&:hover': {
            background:
              'linear-gradient(270deg, rgba(62, 135, 255, 0.75) 0%, rgba(56, 132, 255, 0.75) 100%)',
            border: '1px solid #EBF3FF',
          },

          '&:focusVisible': {
            outline: '2px solid #3884FF',
          },

          '&:disabled': {
            background: '#0E0E0E',
            opacity: 0.1,
            cursor: 'not-allowed',
          },
        },
      },
    }),

    TextInput: TextInput.extend({
      defaultProps: {
        size: 'md',
      },
      styles: {
        input: {
          minHeight: 40,
          padding: '10px 12px',
          fontSize: '14px',
          background: '#fff',
          border: '1px solid #EEEFF1',

          '&:focusVisible': {
            outline: '2px solid #3884FF',
          },

          '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
            outline: '1px solid #EEEFF1',
          },

          '[dataError] &': {
            border: '1px solid #EC2121',
          },
        },
      },
    }),

    Select: Select.extend({
      defaultProps: {
        size: 'md',
      },
      styles: {
        input: {
          minHeight: 40,
          padding: '10px 12px',
          fontSize: '14px',
          background: '#fff',
          border: '1px solid #EEEFF1',

          '&:focusVisible': {
            outline: '2px solid #3884FF',
          },

          '[dataError] &': {
            border: '1px solid #EC2121',
          },
        },
      },
    }),

    Checkbox: Checkbox.extend({
      defaultProps: {
        radius: 4,
      },
      styles: {
        input: {
          border: '1px solid #EEEFF1',
          background: '#fff',

          '&:checked': {
            bg: '#3884FF',
            border: '1px solid #3884FF',
          },
        },
      },
    }),

    PasswordInput: PasswordInput.extend({
      defaultProps: {
        size: 'md',
      },
      styles: {
        input: {
          minHeight: 40,
          padding: '10px 12px',
          fontSize: '14px',
          background: '#fff',
          border: '1px solid #EEEFF1',

          '&:focusVisible': {
            outline: '2px solid #3884FF',
          },

          '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
            outline: '1px solid #EEEFF1',
          },

          '[dataError] &': {
            border: '1px solid #EC2121',
          },
        },

        visibilityToggle: {
          color: '#787B82',
        },
      },
    }),

    Textarea: Textarea.extend({
      defaultProps: {
        size: 'md',
      },
      styles: {
        input: {
          minHeight: 40,
          maxHeight: 200,
          padding: '10px 12px',
          fontSize: '14px',
          background: '#fff',
          border: '1px solid #EEEFF1',

          '&:focusVisible': {
            outline: '2px solid #3884FF',
          },
        },
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
  },
})
