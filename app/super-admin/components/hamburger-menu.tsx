"use client"

interface HamburgerMenuProps {
  isOpen: boolean
  onClick: () => void
}

export function HamburgerMenu({ isOpen, onClick }: HamburgerMenuProps) {
  return (
    <button
      onClick={onClick}
      className="relative inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 transition-colors md:hidden"
      aria-expanded={isOpen}
      aria-label="Toggle navigation menu"
    >
      <div className="w-6 h-6 flex flex-col justify-center items-center">
        <span
          className={`block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
            isOpen ? "rotate-45 translate-y-1.5" : "-translate-y-1"
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
            isOpen ? "-rotate-45 -translate-y-1.5" : "translate-y-1"
          }`}
        />
      </div>
    </button>
  )
}
