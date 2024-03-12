import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { assert } from "chai";
import { Noter } from "../target/types/noter";

describe("noter", () => {
  const provider = anchor.AnchorProvider.env();

  anchor.setProvider(provider);

  const program = anchor.workspace.Noter as Program<Noter>;

  let note = anchor.web3.Keypair.generate();

  it("can create a note", async () => {
    await program.rpc.createNote("Content of New Note", {
      accounts: {
        note: note.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [note],
    });

    let newNote = await program.account.note.fetch(note.publicKey);

    assert.strictEqual(newNote.content, "Content of New Note");
    assert.strictEqual(
      newNote.user.toBase58(),
      provider.wallet.publicKey.toBase58()
    );
  });

  it("can delete a note", async () => {
    await program.rpc.deleteNote({
      accounts: {
        note: note.publicKey,
        user: provider.wallet.publicKey,
      },
    });

    let deletedNote = await program.account.note.fetchNullable(
      note.publicKey
    );

    assert.ok(deletedNote == null);
  });
});
