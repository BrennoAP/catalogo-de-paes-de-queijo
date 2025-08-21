// public/js/novaPadariaModal.js
document.addEventListener("DOMContentLoaded", () => {
  const formPadaria = document.getElementById("novaPadariaForm");

  if (!formPadaria) return; // se não encontrar o form, sai

  formPadaria.addEventListener("submit", async (e) => {
    e.preventDefault();

    // pega todos os campos do form automaticamente
    const formData = new FormData(formPadaria);
    const data = Object.fromEntries(formData); // { name: "...", endereco: "..." }

    try {
      // envia para o backend
      const response = await fetch("/padarias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erro ao salvar padaria");

      const novaPadaria = await response.json();

      // atualiza o select de padarias no formulário de pao
      const selectPadaria = document.getElementById("padariaSelect");
      if (selectPadaria) {
        const option = document.createElement("option");
        option.value = novaPadaria.id;
        option.textContent = `${novaPadaria.name} - ${novaPadaria.endereco}`;
        option.selected = true; // seleciona automaticamente a nova padaria
        selectPadaria.appendChild(option);
      }

      // fecha o modal do Bootstrap
      const modalElement = document.getElementById("novaPadariaModal");
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement) 
                      || new bootstrap.Modal(modalElement);
        modal.hide();
      }

      // reseta o formulário do modal
      formPadaria.reset();

    } catch (err) {
      console.error("Erro ao salvar padaria:", err);
      alert("Erro ao salvar padaria. Veja o console para detalhes.");
    }
  });
});
