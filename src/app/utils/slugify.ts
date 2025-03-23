export const slugify = (text: string) => {
    return text
      .normalize("NFD") // Descompone caracteres acentuados en su forma base
      .replace(/[\u0300-\u036f]/g, "") // Elimina los diacríticos (tildes, etc.)
      .toLowerCase() // Convierte todo a minúsculas
      .replace(/ñ/g, "n") // Reemplaza la "ñ" manualmente
      .replace(/[^a-z0-9 -]/g, "") // Elimina caracteres no alfanuméricos excepto espacios y guiones
      .replace(/\s+/g, "-") // Reemplaza espacios con guiones
      .replace(/-+/g, "-"); // Reemplaza múltiples guiones por uno solo
  };