import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "Green Mart. - Store Dashboard",
    description: "Green Mart. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
