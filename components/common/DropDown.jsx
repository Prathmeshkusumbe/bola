import { Fragment } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import Link from 'next/link'
// import { ChevronDownIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function DropDown({name, dropDownList}) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          {name}
          {/* <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" /> */}
          <span className="icon-[gridicons--dropdown]"></span>
        </MenuButton>
      </div>

      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="text-lg absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {
              dropDownList.map((ele, i) => (
                <MenuItem key={i} onClick={ele.onClick ? ele.onClick : null}>
                  {({ focus }) => (
                    <div className={`pt-2 pb-2 text-slate-900 pl-4 ${!(dropDownList.length-1 == i) && 'border-b'}`}>
                      {ele?.link ? (
                        <Link href={ele.link}>{ele?.name}</Link>
                      ) : (
                        <div className='cursor-pointer'>{ele.name}</div>
                      )}
                    </div>
                  )}
                </MenuItem>
              ))
            }
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  )
}
