"use client"
import React from 'react'
import { useTheme } from "next-themes";


const ThemeButton = () => {
    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;

    return (
        <button
            onClick={() => theme == "dark"? setTheme('light'): setTheme("dark")}
            className='bg-gray-800 text-sm dark:bg-gray-50 hover:bg-gray-600 dark:hover:bg-gray-300 transition-all duration-100 text-white dark:text-gray-800  py-2   rounded-lg  '>
            Toggle Mode
        </button>
    )
}

export default ThemeButton