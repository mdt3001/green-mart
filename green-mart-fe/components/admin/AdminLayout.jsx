'use client'
import { useEffect, useState } from "react"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import AdminNavbar from "./AdminNavbar"
import AdminSidebar from "./AdminSidebar"
import axiosInstance from "@/lib/axios/axiosInstance"
import { API_PATHS } from "@/utils/apiPaths"

const AdminLayout = ({ children }) => {

    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        fetchIsAdmin()
    }, [])

    const fetchIsAdmin = async () => {
        // Only run on client side
        if (typeof window === 'undefined') {
            setIsAdmin(false)
            setLoading(false)
            return
        }
        
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                setIsAdmin(false)
                setLoading(false)
                return
            }

            const response = await axiosInstance.get(API_PATHS.CUSTOMER.PROFILE)
            const userData = response.data.data || response.data
            
            // Check if user has admin role
            const hasAdminRole = userData.roles?.includes('admin')
            setIsAdmin(hasAdminRole)
        } catch (error) {
            console.error('Error checking admin status:', error)
            setIsAdmin(false)
        } finally {
            setLoading(false)
        }
    }

    // Prevent hydration mismatch
    if (!mounted) {
        return <Loading />
    }

    return loading ? (
        <Loading />
    ) : isAdmin ? (
        <div className="flex flex-col h-screen">
            <AdminNavbar />
            <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
                <AdminSidebar />
                <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
                    {children}
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">You are not authorized to access this page</h1>
            <Link href="/" className="bg-slate-700 text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full">
                Go to home <ArrowRightIcon size={18} />
            </Link>
        </div>
    )
}

export default AdminLayout