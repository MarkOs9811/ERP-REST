import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import * as LucideIcons from "lucide-react";
import "../../css/estilosDelivery/EstiloBannerList.css";

const BannerList = ({ onEdit }) => {
  const queryClient = useQueryClient();

  const { data: banners, isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const { data } = await axios.get("/api/delivery/bannerPromo");
      return data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, isActive }) => {
      await axios.patch(`/api/delivery/bannerPromo/${id}/status`, { isActive });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["banners"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/api/delivery/bannerPromo/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["banners"] }),
  });

  if (isLoading)
    return <div className="text-center py-5">Cargando banners...</div>;

  return (
    <div className="banner-list-card">
      <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <LucideIcons.LayoutGrid size={20} />
        Banners Activos
      </h4>

      <div className="list-group list-group-flush">
        {banners?.map((banner) => (
          <div key={banner.id} className="banner-item">
            <div className="banner-info">
              <div
                className="banner-mini-preview"
                style={{
                  backgroundColor: banner.bgColor,
                  backgroundImage: banner.gradient
                    ? `linear-gradient(135deg, ${banner.bgColor}, ${banner.gradientColor})`
                    : "none",
                }}
              />
              <div>
                <p className="banner-name">{banner.title}</p>
                <small className="text-muted">
                  {banner.tag} • {banner.offer}
                </small>
              </div>
            </div>

            <div className="banner-actions">
              <button
                className="btn btn-outline-secondary btn-sm rounded-3 border-0 me-1"
                onClick={() => onEdit(banner)}
              >
                <LucideIcons.Edit2 size={16} />
              </button>
              <div className="form-check form-switch m-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={banner.isActive}
                  onChange={(e) =>
                    statusMutation.mutate({
                      id: banner.id,
                      isActive: e.target.checked,
                    })
                  }
                />
              </div>
              <button
                className="btn btn-outline-danger btn-sm rounded-3 border-0"
                onClick={() => deleteMutation.mutate(banner.id)}
              >
                <LucideIcons.Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {banners?.length === 0 && (
          <div className="text-center py-4 text-muted">
            No hay banners configurados.
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerList;
