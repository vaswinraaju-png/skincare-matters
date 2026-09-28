"use client";import {useEffect,useState} from "react";import {browser} from "@/lib/db";
export const sb=typeof window!=="undefined"?browser():null;
export function useWs(){const [ws,setWs]=useState(null);useEffect(()=>{sb.from("workspaces").select("*").limit(1).then(({data})=>setWs(data?.[0]||null));},[]);return ws;}
