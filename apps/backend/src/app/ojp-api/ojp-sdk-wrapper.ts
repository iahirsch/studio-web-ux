// apps/backend/src/app/ojp-api/ojp-sdk-wrapper.ts
let OJP: any = null;

export async function initializeOJP() {
    if (!OJP) {
        const module = await import('ojp-sdk');
        OJP = module;
    }
    return OJP;
}

export async function getOJP() {
    return await initializeOJP();
}