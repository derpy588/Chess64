import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
            colors: {
                'dark-charcoal': '#333333',
                'light-vermilion': '#b85341',
                'dark-vermilion': '#963c2e',
                'russian-green': '#719577',
                'rangoon-green': '#161616',
                'soft-blue': '#5e7fe2',
                'sky-blue': '#95cce8',
                'denim-blue': '#73b6e6',
                'light-blue-grey': '#c2c8e1',
                'purple-sage': '#8362c9',
                'xdark-gray': '#202225',
                'gunmetal': '#2e3035',
                'tuna': '#37393e',
                'charcoal-gray': '#3c3e44',
                'chess-green': '#779952',
                'chess-gray': '#edeed1',
                'chess-green-selected': '#779952',
                'chess-gray-selected': '#b0b09e'
            },
            spacing: {
                '1/8': '12.5%'
            }
        },
    },

    plugins: [forms],
};
