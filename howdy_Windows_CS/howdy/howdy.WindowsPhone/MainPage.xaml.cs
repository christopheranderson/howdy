using System;
using System.Diagnostics;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Navigation;

namespace howdy
{
    public sealed partial class MainPage : Page
    {
        private bool isLoggedin = false;
        private bool logginIn = false;
        private async void ButtonLogin_Click(object sender, RoutedEventArgs e)
        {
            ((Button)sender).IsEnabled = false;
            try
            {
                if (!isLoggedin)
                {
                    // Login the user and then load data from the mobile service.
                    await AuthenticateAsync();
                    await RefreshUsers();
                    await RegisterUser();
                    await RefreshUsers();
                    if (curr != null)
                    {
                        TitleBlock.Text = "Howdy! - " + parseDisplayName(curr.Name);
                    }
                }
                else
                {
                    await RefreshUsers();
                }
            }
            catch (Exception exc)
            {
                Debug.WriteLine(exc.ToString());
            }
            ((Button)sender).IsEnabled = true;
        }

        protected override async void OnNavigatedTo(NavigationEventArgs e)
        {
            try
            {
                if (!isLoggedin && !logginIn)
                {
                    logginIn = true;
                    await AuthenticateAsync(true);
                    logginIn = false;
                }

                if (isLoggedin)
                {
                    await RefreshUsers();
                    await RegisterUser();
                    await RefreshUsers();
                }
            }
            catch (Exception)
            {
                //
            }
        }

        partial void hideButtonLogin()
        {
            //ButtonLogin.Visibility = Windows.UI.Xaml.Visibility.Collapsed;
            ButtonLogin.Content = "Refresh";
        }

        private string parseDisplayName(string name)
        {
            int pos = curr.Name.IndexOf(" ");
            string val = null;
            if(pos > 0) {
                val = name.Substring(0, pos);
            }
            else
            {
                val = name;
            }
            return val;
        }
    }
}
