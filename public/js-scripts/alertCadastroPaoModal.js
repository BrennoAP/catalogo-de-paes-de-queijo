ocument.addEventListener("DOMContentLoaded", () => {
  const formPao = document.querySelector('form[action="/create"]');

  if (!formPao) return;

  formPao.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(formPao); // inclui foto

    try {
      const response = await fetch("/create", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        alert("Erro ao criar pão: " + (result.error || "desconhecido"));
        return;
      }

      alert(result.message); // exibe sucesso
      formPao.reset();       // limpa form

    } catch (err) {
      alert("Erro ao criar pão. Veja o console.");
      console.error(err);
    }
  });
});