import "./globals.css";import Nav from "@/components/Nav";
export const metadata={title:"Relay: WhatsApp Business"};export const viewport={width:"device-width",initialScale:1,viewportFit:"cover"};
export default function R({children}){return <html lang="en"><body><Nav/><main className="max-w-6xl mx-auto p-4 overflow-x-hidden">{children}</main></body></html>;}
