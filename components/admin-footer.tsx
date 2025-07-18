"use client"

export function AdminFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4 mt-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>© {currentYear} VictoryVault. All rights reserved.</span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Admin Panel v2.1.0
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <a href="/admin/system-status" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
            System Status
          </a>
          <a href="/admin/support" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
            Support
          </a>
          <a href="/admin/documentation" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
            Documentation
          </a>
        </div>
      </div>
    </footer>
  )
}
