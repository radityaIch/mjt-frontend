import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { getPermitById } from "../../api/TravelPermitAPI.js";

import { getAllSupply } from "../../api/TravelSupplyAPI.js";

export default function PermitTemplate() {
  const history = useHistory();
  const { id } = useParams();

  const [goods, setGoods] = useState([
    {
      good_unit: "",
      qty: 0,
      keterangan: "",
    },
  ]);

  const [permit, setPermit] = useState({
    no_do: "",
    pengirim: "",
    alamat_muat: "",
    alamat_kirim: "",
    no_telp: "",
    armada: {
      nopol: "",
      driver: "",
      unit: "",
      pengiriman: "",
      harga_beli: 0,
      harga_jual: 0,
    },
    barang: goods,
  });

  useEffect(() => {
    const getPermitData = async (id) => {
      const permitData = await getPermitById(id);
      if (permitData.status) {
        history.push("/dashboard/surat-jalan/dalam-perjalanan");
      } else {
        const supplyData = await getAllSupply(id);
        const supplies = supplyData.map((supply) => ({
          good_unit: supply.barang,
          qty: supply.qty,
          keterangan: supply.keterangan,
        }));

        setGoods(supplies);

        const permitEdit = {
          no_do: permitData.no_do,
          pengirim: permitData.pengirim,
          alamat_muat: permitData.alamat_muat,
          alamat_kirim: permitData.alamat_kirim,
          no_telp: permitData.no_telp,
          armada: {
            nopol: permitData.nopol,
            driver: permitData.driver,
            unit: permitData.unit,
            pengiriman: permitData.pengiriman,
            harga_beli: permitData.harga_beli,
            harga_jual: permitData.harga_jual,
          },
          barang: supplies,
        };
        setPermit(permitEdit);
      }
    };

    getPermitData(id);
  }, [history, id]);

  return (
    <div>
      <h2>Surat</h2>
    </div>
  );
}
