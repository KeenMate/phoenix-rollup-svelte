defmodule ProjectNameWeb.Helpers.AppsHelper do
  def get_directories(path) do
    File.ls!(path) |> Enum.filter(&File.dir?(Path.join(path, &1)))
  end

  defp get_style_path(app_name,base_path) do
    Path.join([base_path,app_name,"style.css"])
  end

  defp get_script_path(app_name,base_path) do
    Path.join([base_path,app_name,"main.mjs"])
  end

  def create_manifest_entry(app_name,base_path) do
    %{name: app_name,style_path: get_style_path(app_name,base_path), script_path: get_script_path(app_name,base_path)}
  end

  def create_manifest(apps_path,application)  do
    full_path = Path.join([:code.priv_dir(application),"static", apps_path])

    get_directories(full_path) |> Enum.map(&(create_manifest_entry(&1,apps_path)))
  end

end
