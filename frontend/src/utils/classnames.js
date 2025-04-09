
export function cns(...classes) {
    return classes.filter(Boolean).join(" ");
}