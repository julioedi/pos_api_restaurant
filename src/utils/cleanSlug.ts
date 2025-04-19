export const cleanSlug = ($slug: string | number): string => {
    // Convert number to string if necessary
    if (typeof $slug === "number") {
        $slug = $slug.toString();
    }

    // Replace all non-alphanumeric characters (except - and _) with spaces
    $slug = $slug.replace(/[^a-zA-Z0-9\-_]/g, ' ');

    // Replace spaces (or sequences of spaces) with a single dash
    $slug = $slug.replace(/\s+/g, "-");

    // Replace multiple consecutive dashes or underscores with a single dash
    $slug = $slug.replace(/[-_]+/g, "-");

    // Remove any trailing dashes or underscores
    $slug = $slug.replace(/[-_]+$/g, "");

    // Convert the slug to lowercase for consistency
    $slug = $slug.toLowerCase();

    return $slug;
}
