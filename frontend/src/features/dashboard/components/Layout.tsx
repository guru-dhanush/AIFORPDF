import { AppSidebar } from "@/shared/components/app-sidebar"

import {
    SidebarInset,
    SidebarProvider,
} from "@/shared/components/ui/sidebar"

import Dashboard from "./Dashboard"

export default function Layout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Dashboard />
            </SidebarInset>
        </SidebarProvider>
    )
}
