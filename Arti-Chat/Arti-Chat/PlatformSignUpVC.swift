//
//  PlatformSignUpVC.swift
//  Arti-Chat
//
//  Created by Komal Hirani on 11/25/16.
//  Copyright © 2016 Team Rick. All rights reserved.
//

import UIKit

class PlatformSignUpVC: UIViewController {

    //Buttons
    @IBOutlet weak var emailButton: UIButton!
    @IBOutlet weak var facebookButton: UIButton!
    @IBOutlet weak var twitterButton: UIButton!
    
    //Images
    var selectEmail = UIImage(named: "selectEmail")
    var unselectEmail = UIImage(named: "unselectEmail")
    var selectFacebook = UIImage(named: "selectFacebook")
    var unselectFacebook = UIImage(named: "unselectFacebook")
    var selectTwitter = UIImage(named: "selectTwitter")
    var unselectTwitter = UIImage(named: "unselectTwitter")
    
    //Bools
    var isEmailClicked:Bool!
    var isFacebookClicked:Bool!
    var isTwitterClicked:Bool!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        isEmailClicked = false
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func emailPressed(_ sender: Any) {
        if isEmailClicked == true {
            isEmailClicked = false
        } else {
            isEmailClicked = true
        }
        
        if isEmailClicked  == true {
            emailButton.setImage(selectEmail, for: .normal)
        } else {
            emailButton.setImage(unselectEmail, for: .normal)
        }
    }
    
    @IBAction func facebookPressed(_ sender: Any) {
        if isFacebookClicked == true {
            isFacebookClicked = false
        } else {
            isFacebookClicked = true
        }
        
        if isFacebookClicked  == true {
            facebookButton.setImage(selectFacebook, for: .normal)
        } else {
            facebookButton.setImage(unselectFacebook, for: .normal)
        }
    }
    
    @IBAction func twitterPressed(_ sender: Any) {
        if isTwitterClicked == true {
            isTwitterClicked = false
        } else {
            isTwitterClicked = true
        }
        
        if isTwitterClicked  == true {
            twitterButton.setImage(selectTwitter, for: .normal)
        } else {
            twitterButton.setImage(unselectTwitter, for: .normal)
        }
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
