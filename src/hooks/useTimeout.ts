import {useCallback, useRef, useState} from "react";

export const useTimeout = () => {
    const [tick, setTick] = useState<number>(0);
    const timeRef = useRef<any>(-1);
    const startTimer = useCallback(() => {
        const timer = setInterval(() => {
            setTick(tick=>tick+1)
        }, 1000);
        timeRef.current = timer;
    }, []);

    const endTimer = useCallback(()=>{
        setTick(0);
        clearInterval(timeRef.current);
    }, []);

    return { startTimer, endTimer, tick }
}