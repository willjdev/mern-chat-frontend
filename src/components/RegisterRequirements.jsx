import React from 'react';

export const RegisterRequirements = ({ isLoginOrRegister, isClicked, type, username = null, lengthT = null, uppercaseT = null, lowercaseT = null, numberT = null, specialCharT = null }) => {
  return (
    <div className={`w-full mb-2 p-2 bg-zinc-200 border border-gray-950 shadow-md rounded-sm transition-opacity transform ${ isLoginOrRegister === 'register' && isClicked ? 'opacity-100 translate-y-0 transition duration-500 ease-out' : 'hidden opacity-0 -translate-y-2' }`}>
          <p className="text-xs font-semibold">{ type } requirements:</p>
          <ul className="ml-4 text-xs">
            { type === 'Username' && <li className={username ? 'list-disc' : 'text-red-500 custom-bullet'}>Username most be at least 1 character long</li>}
            { type === 'Password' && <li className={lengthT ? 'list-disc' : 'text-red-500 custom-bullet'}>Most be at least 8 characters long</li>}
            { type === 'Password' && <li className={uppercaseT ? 'list-disc' : 'text-red-500 custom-bullet'}>Most contain at least one capital letter</li>}
            { type === 'Password' && <li className={lowercaseT ? 'list-disc' : 'text-red-500 custom-bullet'}>Most contain at least one lower-case letter</li>}
            { type === 'Password' && <li className={numberT ? 'list-disc' : 'text-red-500 custom-bullet'}>Most contain at least one number</li>}
            { type === 'Password' && <li className={specialCharT ? 'list-disc' : 'text-red-500 custom-bullet'}>Most contain at least one special characters</li>}
          </ul>
        </div>
  )
}
